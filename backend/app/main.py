"""FastAPI application entrypoint for Crop Disease Detection."""
import io
import logging
import os
import time
from collections import defaultdict
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image, UnidentifiedImageError
from starlette.requests import Request

from app.core.config import settings
from app.schemas.prediction import HealthResponse, PredictionResponse
from app.services.predictor import predictor

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("crop_disease_api")

# Configure Pillow decompression bomb protection
Image.MAX_IMAGE_PIXELS = settings.MAX_IMAGE_PIXELS

# Lightweight in-memory rate limiter for expensive inference endpoint (/predict)
_rate_limit_records = defaultdict(list)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan context manager to preload model resources on startup."""
    logger.info("Initializing ML model and class labels...")
    try:
        predictor.load_resources()
        logger.info(
            "Model loaded successfully with %d classes.", len(predictor.class_names)
        )
    except Exception as exc:
        logger.error("Failed to load model during startup: %s", exc)
    yield
    logger.info("Shutting down Crop Disease Detection API.")


app = FastAPI(
    title="Crop Disease Detection API",
    description="High-performance REST API for detecting plant and crop diseases using a custom 29-class CNN.",
    version="1.0.0",
    docs_url="/docs" if settings.DOCS_ENABLED else None,
    redoc_url="/redoc" if settings.DOCS_ENABLED else None,
    debug=settings.DEBUG,
    lifespan=lifespan,
)


# Security Headers Middleware
@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    """Adds essential HTTP security headers to all responses."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "img-src 'self' data: blob:; "
        "script-src 'self'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com data:; "
        "connect-src 'self' http://localhost:5173 http://127.0.0.1:5173 http://localhost:8000 http://127.0.0.1:8000; "
        "frame-ancestors 'none';"
    )
    return response


# Rate Limiting Middleware for Abuse Protection
@app.middleware("http")
async def rate_limiting_middleware(request: Request, call_next):
    """Enforces rate limiting on expensive inference operations."""
    if settings.RATE_LIMIT_ENABLED and request.url.path.rstrip("/") == "/predict" and request.method == "POST":
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        cutoff = now - 60.0

        # Filter timestamps within the 60s sliding window
        recent_requests = [t for t in _rate_limit_records[client_ip] if t > cutoff]

        if len(recent_requests) >= settings.RATE_LIMIT_PER_MINUTE:
            logger.warning("Rate limit exceeded for IP: %s on /predict", client_ip)
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": "Too many prediction requests. Please wait a moment before trying again."
                },
                headers={"Retry-After": "60"},
            )

        recent_requests.append(now)
        _rate_limit_records[client_ip] = recent_requests

        # Occasional memory cleanup if dict grows large
        if len(_rate_limit_records) > 2000:
            for ip in list(_rate_limit_records.keys()):
                _rate_limit_records[ip] = [t for t in _rate_limit_records[ip] if t > cutoff]
                if not _rate_limit_records[ip]:
                    del _rate_limit_records[ip]

    return await call_next(request)


# Global Unhandled Exception Handler (Prevents stack trace / internal path disclosure)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled internal server exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected internal server error occurred."},
    )


# Configure CORS Middleware (Hardened: No credentials, explicit allowed origins & headers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)


@app.get(
    "/",
    summary="Root Welcome",
    tags=["General"],
)
async def root():
    """Root endpoint welcoming users and pointing to documentation."""
    return {
        "message": "Crop Disease Detection API is running.",
        "docs_url": "/docs" if settings.DOCS_ENABLED else None,
        "health_url": "/health",
        "predict_url": "/predict",
    }


@app.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    tags=["System"],
)
async def health_check() -> HealthResponse:
    """Check API status and model availability (exposes no internal paths)."""
    return HealthResponse(
        status="healthy" if predictor.is_loaded else "model_not_loaded",
        model_loaded=predictor.is_loaded,
        num_classes=len(predictor.class_names),
    )


@app.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict Crop Disease from Leaf Image",
    tags=["Inference"],
    status_code=status.HTTP_200_OK,
)
async def predict_disease(
    file: UploadFile = File(..., description="Uploaded plant leaf image (JPEG, PNG, WEBP, BMP)")
) -> PredictionResponse:
    """
    Accepts an uploaded image file, validates format and integrity,
    runs CNN inference, and returns predicted class and confidence.
    """
    # 1. Validate filename presence and sanitize to prevent path traversal
    raw_filename = file.filename or ""
    sanitized_filename = os.path.basename(raw_filename).strip()

    if not sanitized_filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid filename provided in upload.",
        )

    # 2. Read file content safely in-memory
    try:
        content = await file.read()
    except Exception as exc:
        logger.error("Error reading uploaded file: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to read uploaded file payload.",
        )

    # 3. Check for empty payload
    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes).",
        )

    # 4. Check file size limit (10 MB)
    if len(content) > settings.MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Uploaded file exceeds size limit of {settings.MAX_IMAGE_SIZE_BYTES // (1024 * 1024)} MB.",
        )

    # 5. Verify actual image format, raster decode, and dimensions via Pillow
    try:
        # Verify byte integrity and extract format without full raster execution
        test_img = Image.open(io.BytesIO(content))
        test_img.verify()
        img_format = test_img.format

        # Validate against allowed image formats
        if img_format not in ["JPEG", "PNG", "WEBP", "BMP"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported image format: '{img_format}'. Supported formats are JPEG, PNG, WebP, and BMP.",
            )

        # Reopen image for processing (verify closes original descriptor)
        image = Image.open(io.BytesIO(content))
        image.load()  # Force decode raster to catch corrupted/truncated streams

        # Prevent dimensional decompression attacks
        if image.width > settings.MAX_IMAGE_DIMENSION or image.height > settings.MAX_IMAGE_DIMENSION:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Image dimensions ({image.width}x{image.height}) exceed maximum allowed dimension of {settings.MAX_IMAGE_DIMENSION}px.",
            )

        image = image.convert("RGB")
    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError, SyntaxError, ValueError) as img_err:
        logger.warning("Invalid or corrupted image upload attempt: %s", img_err)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or corrupted image file. Please upload a valid JPEG, PNG, WebP, or BMP image.",
        )

    # 6. Run prediction through CropDiseasePredictor
    try:
        prediction_result = predictor.predict(image, top_k=3)
        return prediction_result
    except Exception as err:
        logger.error("Inference failure: %s", err, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing the prediction.",
        )
