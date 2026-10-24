"""Application configuration and constants."""
import os
from pathlib import Path
from typing import List


class Settings:
    # Environment & Debug
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    DOCS_ENABLED: bool = os.getenv("DOCS_ENABLED", "true").lower() == "true"

    # Project Root: CropDiseaseDetection/
    # backend/app/core/config.py -> parent(core) -> parent(app) -> parent(backend) -> parent(CropDiseaseDetection)
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent.parent

    # Model & Label Paths
    MODEL_DIR: Path = BASE_DIR / "model"
    MODEL_PATH: Path = MODEL_DIR / "best_crop_disease_model.keras"
    CLASS_NAMES_PATH: Path = MODEL_DIR / "class_names.json"

    # Preprocessing & Inference Settings
    IMAGE_WIDTH: int = 128
    IMAGE_HEIGHT: int = 128
    IMAGE_CHANNELS: int = 3
    EXPECTED_NUM_CLASSES: int = 29

    # Allowed Upload File Types
    ALLOWED_IMAGE_TYPES: List[str] = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/bmp",
    ]
    ALLOWED_IMAGE_EXTENSIONS: List[str] = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".bmp",
    ]
    MAX_IMAGE_SIZE_BYTES: int = int(
        os.getenv("MAX_IMAGE_SIZE_BYTES", str(10 * 1024 * 1024))
    )  # 10 MB limit
    MAX_IMAGE_PIXELS: int = 25_000_000  # Decompression bomb prevention
    MAX_IMAGE_DIMENSION: int = 4096  # Maximum width/height in pixels

    # Abuse Protection / Rate Limiting (requests per minute per IP for expensive inference)
    RATE_LIMIT_ENABLED: bool = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "120"))

    # CORS configuration for frontend
    @property
    def CORS_ORIGINS(self) -> List[str]:
        raw_origins = os.getenv("CORS_ORIGINS")
        if raw_origins:
            return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
        return [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]


settings = Settings()
