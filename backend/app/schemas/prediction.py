"""Prediction response schemas."""
from typing import List, Optional
from pydantic import BaseModel, Field


class ClassPrediction(BaseModel):
    """Prediction for a single class label."""
    class_name: str = Field(..., description="Name of the predicted class")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")


class PredictionResponse(BaseModel):
    """Schema for disease prediction response."""
    predicted_class: str = Field(..., description="Predicted crop and disease class label")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model prediction confidence score")
    crop: Optional[str] = Field(None, description="Extracted crop name (e.g., Apple, Tomato)")
    disease: Optional[str] = Field(None, description="Extracted disease name or 'Healthy'")
    is_healthy: Optional[bool] = Field(None, description="True if the crop is identified as healthy")
    top_predictions: Optional[List[ClassPrediction]] = Field(
        default=None, description="Optional ranked list of top-k predictions"
    )


class HealthResponse(BaseModel):
    """Schema for backend health check."""
    status: str = Field(..., description="Service status (e.g. 'healthy')")
    model_loaded: bool = Field(..., description="Whether the trained CNN is loaded in memory")
    num_classes: int = Field(..., description="Number of registered disease classes")
