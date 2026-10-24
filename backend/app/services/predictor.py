"""Predictor service for Crop Disease Detection using trained CNN model."""
import io
import json
from pathlib import Path
from typing import List, Optional, Tuple, Union

import keras
import numpy as np
from PIL import Image

from app.core.config import settings
from app.schemas.prediction import ClassPrediction, PredictionResponse


class CropDiseasePredictor:
    """Manages model loading, preprocessing, and inference."""

    def __init__(self) -> None:
        self.model: Optional[keras.Model] = None
        self.class_names: List[str] = []
        self._is_loaded: bool = False

    @property
    def is_loaded(self) -> bool:
        """Check if model and classes are loaded."""
        return self._is_loaded

    def load_resources(self) -> None:
        """Load the trained Keras model and class names JSON."""
        if self._is_loaded:
            return

        # 1. Validate paths
        if not settings.MODEL_PATH.exists():
            raise FileNotFoundError(f"Model file not found at: {settings.MODEL_PATH}")
        if not settings.CLASS_NAMES_PATH.exists():
            raise FileNotFoundError(f"Class names file not found at: {settings.CLASS_NAMES_PATH}")

        # 2. Load class labels
        with open(settings.CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
            self.class_names = json.load(f)

        if len(self.class_names) != settings.EXPECTED_NUM_CLASSES:
            raise ValueError(
                f"Expected {settings.EXPECTED_NUM_CLASSES} classes, but found {len(self.class_names)}"
            )

        # 3. Load model
        self.model = keras.models.load_model(str(settings.MODEL_PATH))

        # 4. Validate input and output shapes
        expected_input = (None, settings.IMAGE_HEIGHT, settings.IMAGE_WIDTH, settings.IMAGE_CHANNELS)
        expected_output = (None, settings.EXPECTED_NUM_CLASSES)

        if self.model.input_shape != expected_input:
            raise ValueError(
                f"Model input shape mismatch. Expected {expected_input}, got {self.model.input_shape}"
            )
        if self.model.output_shape != expected_output:
            raise ValueError(
                f"Model output shape mismatch. Expected {expected_output}, got {self.model.output_shape}"
            )

        self._is_loaded = True

    def preprocess_image(self, image_input: Union[Image.Image, bytes, Path, str]) -> np.ndarray:
        """
        Preprocess input image to the format expected by the CNN:
        RGB -> 128x128 -> float32 -> divide by 255.0 -> batch dimension (1, 128, 128, 3).
        """
        if isinstance(image_input, (str, Path)):
            pil_image = Image.open(image_input)
        elif isinstance(image_input, bytes):
            pil_image = Image.open(io.BytesIO(image_input))
        elif isinstance(image_input, Image.Image):
            pil_image = image_input
        else:
            raise TypeError("Unsupported image input type. Expected Image, bytes, str, or Path.")

        # Ensure RGB format
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")

        # Resize to 128x128
        target_size = (settings.IMAGE_WIDTH, settings.IMAGE_HEIGHT)
        if pil_image.size != target_size:
            pil_image = pil_image.resize(target_size, Image.Resampling.BILINEAR)

        # Convert to float32 and normalize [0, 1]
        img_array = np.array(pil_image, dtype=np.float32) / 255.0

        # Expand batch dimension: (1, 128, 128, 3)
        batch_array = np.expand_dims(img_array, axis=0)
        return batch_array

    def predict(
        self, image_input: Union[Image.Image, bytes, Path, str], top_k: int = 3
    ) -> PredictionResponse:
        """Run CNN inference on the image and return structured prediction response."""
        if not self._is_loaded or self.model is None:
            self.load_resources()

        # Preprocess
        tensor = self.preprocess_image(image_input)

        # Run inference
        raw_predictions = self.model.predict(tensor, verbose=0)[0]

        # Top prediction
        predicted_idx = int(np.argmax(raw_predictions))
        predicted_class = self.class_names[predicted_idx]
        confidence = float(raw_predictions[predicted_idx])

        # Parse crop, disease, and health status
        crop, disease, is_healthy = self._parse_class_label(predicted_class)

        # Top-k predictions
        top_k_indices = np.argsort(raw_predictions)[::-1][:top_k]
        top_predictions = [
            ClassPrediction(
                class_name=self.class_names[idx],
                confidence=round(float(raw_predictions[idx]), 4),
            )
            for idx in top_k_indices
        ]

        return PredictionResponse(
            predicted_class=predicted_class,
            confidence=round(confidence, 4),
            crop=crop,
            disease=disease,
            is_healthy=is_healthy,
            top_predictions=top_predictions,
        )

    @staticmethod
    def _parse_class_label(label: str) -> Tuple[Optional[str], Optional[str], Optional[bool]]:
        """
        Parse human-readable crop and disease from label format 'Crop - Disease'.
        Example: 'Tomato - Early Blight' -> ('Tomato', 'Early Blight', False)
        Example: 'Apple - Healthy' -> ('Apple', 'Healthy', True)
        """
        if " - " in label:
            parts = label.split(" - ", 1)
            crop = parts[0].strip()
            disease = parts[1].strip()
            is_healthy = disease.lower() == "healthy"
            return crop, disease, is_healthy
        return None, None, None


# Global singleton instance for service injection
predictor = CropDiseasePredictor()
