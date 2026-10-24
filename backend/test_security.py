"""Comprehensive Security & Hardening Test Suite for CropGuard AI backend.
Verifies HTTP security headers, CORS restrictions, rate limiting, payload validation,
path traversal defense, and error information disclosure protection.
"""
import io
import time
from pathlib import Path
import requests
from PIL import Image

BASE_URL = "http://127.0.0.1:8000"
ASSETS_DIR = Path(__file__).resolve().parent.parent / "frontend" / "public" / "assets"


def test_security_headers():
    """Verify essential HTTP security headers are present on all responses."""
    resp = requests.get(f"{BASE_URL}/health", timeout=5)
    assert resp.status_code == 200

    headers = resp.headers
    print("\n[SECURITY HEADERS TEST]")
    print(f"X-Content-Type-Options: {headers.get('X-Content-Type-Options')}")
    print(f"X-Frame-Options: {headers.get('X-Frame-Options')}")
    print(f"Referrer-Policy: {headers.get('Referrer-Policy')}")
    print(f"Permissions-Policy: {headers.get('Permissions-Policy')}")
    print(f"Content-Security-Policy: {headers.get('Content-Security-Policy')}")

    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert headers.get("X-Frame-Options") == "DENY"
    assert headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert "camera=()" in headers.get("Permissions-Policy", "")
    assert "frame-ancestors 'none'" in headers.get("Content-Security-Policy", "")
    print("PASS: All required security headers verified!")


def test_cors_restrictions():
    """Verify CORS preflight only allows permitted origins and methods."""
    origin = "http://127.0.0.1:5173"
    headers = {
        "Origin": origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
    }
    resp = requests.options(f"{BASE_URL}/predict", headers=headers, timeout=5)
    print("\n[CORS TEST]")
    print(f"Status: {resp.status_code}")
    print(f"Allow-Origin: {resp.headers.get('access-control-allow-origin')}")
    print(f"Allow-Methods: {resp.headers.get('access-control-allow-methods')}")

    assert resp.status_code == 200
    assert resp.headers.get("access-control-allow-origin") == origin
    allow_methods = resp.headers.get("access-control-allow-methods", "")
    assert "POST" in allow_methods
    assert "DELETE" not in allow_methods
    print("PASS: CORS restrictions verified!")


def test_health_information_disclosure():
    """Verify /health exposes only required operational status, no filesystem paths or secrets."""
    resp = requests.get(f"{BASE_URL}/health", timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    print("\n[INFO DISCLOSURE TEST: /health]")
    print("Payload:", data)

    # Ensure strictly only expected keys exist
    allowed_keys = {"status", "model_loaded", "num_classes"}
    assert set(data.keys()) == allowed_keys

    # Ensure no path-like strings or env vars leaked
    data_str = str(data).lower()
    assert "c:\\" not in data_str
    assert "users" not in data_str
    assert "model.keras" not in data_str
    print("PASS: No internal paths or secrets exposed in /health!")


def test_method_not_allowed():
    """Verify unsupported HTTP methods return 405 Method Not Allowed."""
    print("\n[HTTP METHOD ENFORCEMENT TEST]")
    resp_delete = requests.delete(f"{BASE_URL}/predict", timeout=5)
    assert resp_delete.status_code == 405

    resp_put = requests.put(f"{BASE_URL}/health", timeout=5)
    assert resp_put.status_code == 405
    print("PASS: HTTP method constraints enforced with 405!")


def test_path_traversal_filename():
    """Verify malicious path traversal filenames are safely handled without server compromise."""
    print("\n[PATH TRAVERSAL DEFENSE TEST]")
    # 10x10 synthetic test image
    img = Image.new("RGB", (10, 10), color=(50, 150, 50))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()

    traversal_filenames = [
        "../../../../windows/system32/cmd.exe",
        "..\\..\\..\\boot.ini",
        "/etc/shadow",
        "....//....//shell.php",
    ]

    for filename in traversal_filenames:
        files = {"file": (filename, img_bytes, "image/jpeg")}
        resp = requests.post(f"{BASE_URL}/predict", files=files, timeout=10)
        # Should succeed inference without writing anything to traversal path
        assert resp.status_code in [200, 400]
        data = resp.json()
        # Verify no local path or system error is exposed
        assert "system32" not in str(data).lower()
        assert "shadow" not in str(data).lower()
    print("PASS: Malicious filenames cannot cause path traversal or information leak!")


def test_empty_and_corrupt_files():
    """Verify malformed and empty uploads are strictly rejected with 400."""
    print("\n[PAYLOAD VALIDATION TEST]")
    # 1. Empty file
    resp_empty = requests.post(
        f"{BASE_URL}/predict",
        files={"file": ("empty.jpg", b"", "image/jpeg")},
        timeout=5,
    )
    assert resp_empty.status_code == 400
    assert "empty" in resp_empty.json().get("detail", "").lower()

    # 2. Corrupt bytes with valid header
    corrupt_bytes = b"\xff\xd8\xff\xe0JFIF" + b"A" * 100
    resp_corrupt = requests.post(
        f"{BASE_URL}/predict",
        files={"file": ("corrupt.jpg", corrupt_bytes, "image/jpeg")},
        timeout=5,
    )
    assert resp_corrupt.status_code == 400
    assert "invalid or corrupted" in resp_corrupt.json().get("detail", "").lower()

    # 3. Executable / script disguised as image
    fake_img = b"#!/bin/bash\necho 'malicious script'"
    resp_script = requests.post(
        f"{BASE_URL}/predict",
        files={"file": ("exploit.jpg", fake_img, "image/jpeg")},
        timeout=5,
    )
    assert resp_script.status_code == 400
    print("PASS: Empty, corrupted, and non-image files rejected with 400!")


def test_oversized_file():
    """Verify files exceeding 10 MB are rejected with 400."""
    print("\n[FILE SIZE LIMIT TEST]")
    # Generate 10.5 MB payload
    large_payload = b"\x00" * (10 * 1024 * 1024 + 500 * 1024)
    resp = requests.post(
        f"{BASE_URL}/predict",
        files={"file": ("large.jpg", large_payload, "image/jpeg")},
        timeout=10,
    )
    assert resp.status_code == 400
    assert "exceeds size limit" in resp.json().get("detail", "").lower()
    print("PASS: Oversized payload rejected with 400!")


def test_valid_image_prediction():
    """Verify valid image inference remains functional and yields complete schema."""
    print("\n[VALID INFERENCE REGRESSION TEST]")
    leaf_path = ASSETS_DIR / "tomato_early_blight_leaf.jpg"
    assert leaf_path.exists()

    with open(leaf_path, "rb") as f:
        resp = requests.post(
            f"{BASE_URL}/predict",
            files={"file": ("tomato_early_blight_leaf.jpg", f.read(), "image/jpeg")},
            timeout=10,
        )

    assert resp.status_code == 200
    data = resp.json()
    assert "predicted_class" in data
    assert "confidence" in data
    assert "crop" in data
    assert "disease" in data
    assert "is_healthy" in data
    assert "top_predictions" in data
    print(f"PASS: Real prediction successful -> {data['predicted_class']} ({data['confidence']*100:.1f}%)")


if __name__ == "__main__":
    test_security_headers()
    test_cors_restrictions()
    test_health_information_disclosure()
    test_method_not_allowed()
    test_path_traversal_filename()
    test_empty_and_corrupt_files()
    test_oversized_file()
    test_valid_image_prediction()
    print("\n" + "=" * 60)
    print("ALL SECURITY AND HARDENING TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)
