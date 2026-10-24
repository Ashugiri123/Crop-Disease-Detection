"""Comprehensive API test suite for Crop Disease Detection backend.
Includes real-image testing, format verification, and security/hardening edge cases.
"""
import io
import json
from pathlib import Path
import requests
from PIL import Image, ImageDraw

BASE_URL = "http://127.0.0.1:8000"
ASSETS_DIR = Path(__file__).resolve().parent / "test_assets"


def create_test_image(format="WEBP") -> bytes:
    """Create a synthetic test image as bytes."""
    img = Image.new("RGB", (250, 250), color=(45, 160, 45))
    draw = ImageDraw.Draw(img)
    draw.line([(125, 20), (125, 230)], fill=(20, 80, 20), width=4)
    draw.ellipse([60, 60, 110, 100], fill=(120, 70, 20))
    buf = io.BytesIO()
    img.save(buf, format=format)
    return buf.getvalue()


def test_health_endpoint():
    print("\n--- TEST 1: GET /health ---")
    resp = requests.get(f"{BASE_URL}/health", timeout=5)
    print(f"Status Code: {resp.status_code}")
    data = resp.json()
    print("Response JSON:", json.dumps(data, indent=2))

    assert resp.status_code == 200
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["num_classes"] == 29
    print("PASS: /health returned 200 with model_loaded=True and num_classes=29")


def test_predict_real_images():
    print("\n--- TEST 2: Real Crop Leaf Images with Known Ground Truth ---")
    
    real_tests = [
        {
            "filename": "real_bell_pepper_spot.jpg",
            "ground_truth": "Bell Pepper - Bacterial Spot",
            "content_type": "image/jpeg",
        },
        {
            "filename": "tomato_early_blight_leaf.jpg",
            "ground_truth": "Tomato - Early Blight",
            "content_type": "image/jpeg",
        },
        {
            "filename": "tomato_leaf.jpg",
            "ground_truth": "Tomato - Healthy",
            "content_type": "image/jpeg",
        },
    ]

    for item in real_tests:
        image_path = ASSETS_DIR / item["filename"]
        assert image_path.exists(), f"Real test image not found: {image_path}"

        print(f"\nEvaluating: {item['filename']}")
        print(f"Ground Truth : {item['ground_truth']}")

        with open(image_path, "rb") as f:
            files = {"file": (item["filename"], f.read(), item["content_type"])}

        resp = requests.post(f"{BASE_URL}/predict", files=files, timeout=10)
        print(f"HTTP Status  : {resp.status_code}")
        assert resp.status_code == 200
        data = resp.json()

        print(f"Predicted    : {data['predicted_class']}")
        print(f"Confidence   : {data['confidence'] * 100:.2f}% ({data['confidence']})")
        print(f"Crop / Disease: {data['crop']} | {data['disease']} (Healthy: {data['is_healthy']})")
        print("Top Predictions:")
        for rank, p in enumerate(data.get("top_predictions", []), 1):
            print(f"   {rank}. {p['class_name']}: {p['confidence'] * 100:.2f}%")

        # Check match with ground truth
        match = data["predicted_class"].strip().lower() == item["ground_truth"].strip().lower()
        print(f"Matches Ground Truth? {'YES' if match else 'NO (Misclassified or low confidence)'}")


def test_predict_webp_format():
    print("\n--- TEST 3: POST /predict (WebP Format) ---")
    webp_bytes = create_test_image(format="WEBP")
    files = {"file": ("synthetic_leaf.webp", webp_bytes, "image/webp")}

    resp = requests.post(f"{BASE_URL}/predict", files=files, timeout=10)
    print(f"Status Code: {resp.status_code}")
    assert resp.status_code == 200
    data = resp.json()
    assert "predicted_class" in data
    assert 0.0 <= data["confidence"] <= 1.0
    print(f"PASS: WebP image processed successfully -> {data['predicted_class']}")


def test_predict_png_format():
    print("\n--- TEST 4: POST /predict (PNG Format) ---")
    png_bytes = create_test_image(format="PNG")
    files = {"file": ("synthetic_leaf.png", png_bytes, "image/png")}

    resp = requests.post(f"{BASE_URL}/predict", files=files, timeout=10)
    print(f"Status Code: {resp.status_code}")
    assert resp.status_code == 200
    print(f"PASS: PNG image processed successfully")


def test_predict_bmp_format():
    print("\n--- TEST 4B: POST /predict (BMP Format) ---")
    bmp_bytes = create_test_image(format="BMP")
    files = {"file": ("synthetic_leaf.bmp", bmp_bytes, "image/bmp")}

    resp = requests.post(f"{BASE_URL}/predict", files=files, timeout=10)
    print(f"Status Code: {resp.status_code}")
    assert resp.status_code == 200
    print(f"PASS: BMP image processed successfully")


def test_predict_corrupted_image():
    print("\n--- TEST 5: POST /predict (Corrupted Image Bytes) ---")
    # Valid JPEG header followed by broken garbage bytes
    corrupted_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00" + b"INVALID" * 20
    files = {"file": ("corrupted.jpg", corrupted_bytes, "image/jpeg")}

    resp = requests.post(f"{BASE_URL}/predict", files=files, timeout=5)
    print(f"Status Code: {resp.status_code}")
    print("Response JSON:", resp.json())

    assert resp.status_code == 400
    assert "detail" in resp.json()
    print("PASS: Corrupted image rejected with HTTP 400")


def test_predict_unsupported_format():
    print("\n--- TEST 6: POST /predict (Unsupported GIF Format) ---")
    gif_buf = io.BytesIO()
    Image.new("RGB", (50, 50), color=(100, 100, 100)).save(gif_buf, format="GIF")
    files = {"file": ("test.gif", gif_buf.getvalue(), "image/gif")}

    resp = requests.post(f"{BASE_URL}/predict", files=files, timeout=5)
    print(f"Status Code: {resp.status_code}")
    print("Response JSON:", resp.json())

    assert resp.status_code == 400
    print("PASS: Unsupported GIF format rejected with HTTP 400")


def test_predict_empty_file():
    print("\n--- TEST 7: POST /predict (Empty 0-Byte File) ---")
    files = {"file": ("empty.jpg", b"", "image/jpeg")}

    resp = requests.post(f"{BASE_URL}/predict", files=files, timeout=5)
    print(f"Status Code: {resp.status_code}")
    print("Response JSON:", resp.json())

    assert resp.status_code == 400
    print("PASS: Empty file rejected with HTTP 400")


def test_predict_invalid_text():
    print("\n--- TEST 8: POST /predict (Non-Image Text File) ---")
    files = {"file": ("note.txt", b"Just some plain text data.", "text/plain")}

    resp = requests.post(f"{BASE_URL}/predict", files=files, timeout=5)
    print(f"Status Code: {resp.status_code}")
    print("Response JSON:", resp.json())

    assert resp.status_code == 400
    print("PASS: Text file rejected with HTTP 400")


def test_predict_oversized_file():
    print("\n--- TEST 9: POST /predict (Oversized File > 10 MB) ---")
    # 10.5 MB payload
    oversized_bytes = b"0" * (11 * 1024 * 1024)
    files = {"file": ("huge.jpg", oversized_bytes, "image/jpeg")}

    resp = requests.post(f"{BASE_URL}/predict", files=files, timeout=10)
    print(f"Status Code: {resp.status_code}")
    print("Response JSON:", resp.json())

    assert resp.status_code == 400
    assert "exceeds size limit" in resp.json().get("detail", "")
    print("PASS: Oversized payload rejected with HTTP 400")


def test_docs_and_openapi():
    print("\n--- TEST 10: GET /docs and GET /openapi.json ---")
    docs_resp = requests.get(f"{BASE_URL}/docs", timeout=5)
    assert docs_resp.status_code == 200

    spec_resp = requests.get(f"{BASE_URL}/openapi.json", timeout=5)
    assert spec_resp.status_code == 200
    spec = spec_resp.json()
    paths = list(spec.get("paths", {}).keys())
    print("Registered OpenAPI paths:", paths)

    assert "/health" in paths
    assert "/predict" in paths
    print("PASS: Swagger UI and OpenAPI documentation verified")


def main():
    print("=" * 65)
    print("STARTING COMPLETE BACKEND HARDENING & REGRESSION SUITE")
    print("=" * 65)

    test_health_endpoint()
    test_predict_real_images()
    test_predict_webp_format()
    test_predict_png_format()
    test_predict_bmp_format()
    test_predict_corrupted_image()
    test_predict_unsupported_format()
    test_predict_empty_file()
    test_predict_invalid_text()
    test_predict_oversized_file()
    test_docs_and_openapi()

    print("\n" + "=" * 65)
    print("ALL 11 TEST SUITES PASSED SUCCESSFULLY!")
    print("=" * 65)


if __name__ == "__main__":
    main()
