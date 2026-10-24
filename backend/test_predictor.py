"""Test script to verify predictor service, model loading, and inference."""
import sys
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from app.core.config import settings
from app.services.predictor import predictor


def create_synthetic_leaf_image() -> Image.Image:
    """Create a synthetic RGB test image simulating a leaf."""
    # Create 200x200 RGBA image (to also verify RGBA -> RGB conversion)
    img = Image.new("RGBA", (200, 200), (34, 139, 34, 255))  # Forest green
    draw = ImageDraw.Draw(img)
    # Add some yellow-brown blight-like spots and vein patterns
    draw.ellipse([50, 50, 90, 80], fill=(139, 69, 19, 255))
    draw.ellipse([110, 100, 140, 130], fill=(160, 82, 45, 255))
    draw.line([(100, 20), (100, 180)], fill=(0, 100, 0, 255), width=3)
    return img


def main():
    print("=" * 60)
    print("RUNNING PREDICTOR SERVICE VERIFICATION")
    print("=" * 60)

    # 1. Verify paths
    print(f"Project root : {settings.BASE_DIR}")
    print(f"Model path   : {settings.MODEL_PATH} (exists: {settings.MODEL_PATH.exists()})")
    print(f"Labels path  : {settings.CLASS_NAMES_PATH} (exists: {settings.CLASS_NAMES_PATH.exists()})")

    # 2. Load model and labels
    print("\nLoading model and labels...")
    predictor.load_resources()
    print("-> Model loaded successfully!")
    print("-> Class labels loaded successfully!")

    # 3. Shape verification
    input_shape = predictor.model.input_shape
    output_shape = predictor.model.output_shape
    num_classes = len(predictor.class_names)
    print(f"\nModel Input Shape  : {input_shape}")
    print(f"Model Output Shape : {output_shape}")
    print(f"Number of Classes  : {num_classes}")

    assert input_shape == (None, 128, 128, 3), f"Unexpected input shape: {input_shape}"
    assert output_shape == (None, 29), f"Unexpected output shape: {output_shape}"
    assert num_classes == 29, f"Unexpected number of classes: {num_classes}"

    # 4. Preprocessing verification
    test_img = create_synthetic_leaf_image()
    print(f"\nSynthetic Test Image: Mode={test_img.mode}, Size={test_img.size}")

    preprocessed = predictor.preprocess_image(test_img)
    print(f"Preprocessed Tensor Shape: {preprocessed.shape}")
    print(f"Preprocessed Dtype       : {preprocessed.dtype}")
    print(f"Value Range              : [{preprocessed.min():.4f}, {preprocessed.max():.4f}]")

    assert preprocessed.shape == (1, 128, 128, 3), f"Wrong tensor shape: {preprocessed.shape}"
    assert preprocessed.dtype == np.float32, f"Wrong dtype: {preprocessed.dtype}"
    assert 0.0 <= preprocessed.min() and preprocessed.max() <= 1.0, "Values out of range [0, 1]"

    # 5. Prediction verification
    print("\nRunning inference...")
    result = predictor.predict(test_img, top_k=3)

    print(f"Predicted Class : {result.predicted_class}")
    print(f"Confidence      : {result.confidence * 100:.2f}% ({result.confidence})")
    print(f"Crop            : {result.crop}")
    print(f"Disease         : {result.disease}")
    print(f"Is Healthy      : {result.is_healthy}")
    print("\nTop-3 Predictions:")
    for rank, p in enumerate(result.top_predictions, 1):
        print(f"  {rank}. {p.class_name}: {p.confidence * 100:.2f}%")

    print("\n" + "=" * 60)
    print("ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!")
    print("=" * 60)


if __name__ == "__main__":
    main()
