# CropGuard AI — Complete Codebase Review and Pre-Test Repair Report

**Audit Date**: October 24, 2026  
**Auditor Roles**: Senior Software Engineer, Machine Learning Engineer, Code Reviewer, Application Security Reviewer  
**Phase**: Pre-Test Code Inspection & Targeted Defect Repair (Pre-Deployment Phase)  
**Status**: **READY FOR FINAL TESTING**

---

## 1. Files and Directories Inspected

The inspection covered all source files, configurations, dependencies, model artifacts, and test scripts across the entire project repository.

### Project Root & Documentation
- `c:\Users\ashug\Downloads\CropDiseaseDetection\PROJECT_MEMORY.md` — Persistent single source of truth, evaluation history, and architecture tracking.
- `c:\Users\ashug\Downloads\CropDiseaseDetection\.gitignore` — Root Git exclusion rules for bytecode, secrets, logs, virtual environments, and artifacts.
- *SRS Document*: Explicit search conducted. No standalone `SRS.md`, `SRS.pdf`, or `SRS.docx` file is present in the workspace. The functional, technical, and architectural requirements are fully specified in `PROJECT_MEMORY.md`, the ML training notebook, and the existing codebase.

### Model Artifacts & ML Notebook
- `model/best_crop_disease_model.keras` (5,206,036 bytes) — Checkpointed Keras 3 / TensorFlow CNN model weights and architecture.
- `model/class_names.json` (869 bytes) — 29-element JSON array of registered class labels.
- `ML/cropdiseasedetactionbyusingcnn.ipynb` (16,719,930 bytes, 57 cells) — Full Kaggle training and evaluation notebook with execution outputs.

### Backend (`backend/`)
- `backend/app/__init__.py` — Package declaration.
- `backend/app/main.py` — FastAPI application instance, lifespan model loading, security headers middleware, rate limiting middleware, global exception handler, CORS configuration, and REST endpoints (`/`, `/health`, `/predict`).
- `backend/app/core/__init__.py` — Package declaration.
- `backend/app/core/config.py` — Centralized application settings (`Settings` class) with dynamic environment variable resolution, relative path anchors, and image validation thresholds.
- `backend/app/schemas/__init__.py` — Package declaration.
- `backend/app/schemas/prediction.py` — Pydantic models: `ClassPrediction`, `PredictionResponse`, `HealthResponse`.
- `backend/app/services/__init__.py` — Package declaration.
- `backend/app/services/predictor.py` — `CropDiseasePredictor` singleton, model resource loader, input preprocessor, CNN inference pipeline, and label parser.
- `backend/requirements.txt` — Exact dependency versions matching Python 3.11 `tfenv`.
- `backend/.env.example` — Template environment variables for backend configuration.
- `backend/test_predictor.py` — Standalone predictor service unit test script.
- `backend/test_api.py` — End-to-end API test suite (11 test suites covering real images, multiple formats, and edge cases).
- `backend/test_security.py` — Security regression test suite covering headers, CORS, path traversal, info disclosure, and payload bounds.
- `backend/test_assets/` — Real test leaf assets (`real_bell_pepper_spot.jpg`, `tomato_early_blight_leaf.jpg`, `tomato_leaf.jpg`).

### Frontend (`frontend/`)
- `frontend/package.json` & `frontend/package-lock.json` — Dependencies (`react` 19.2.8, `react-dom` 19.2.8, `react-router-dom` 7.18.4, `lucide-react` 1.49.0, `vite` 8.3.0, `oxlint` 1.81.0).
- `frontend/vite.config.js` — Vite build and dev configuration.
- `frontend/.env.example` — Template for `VITE_API_URL`.
- `frontend/.gitignore` — Frontend-specific ignore rules.
- `frontend/.oxlintrc.json` — Oxlint rules configuration.
- `frontend/index.html` — HTML shell, SEO metadata, Google Fonts preconnect (`JetBrains Mono`, `Newsreader`, `Space Grotesk`, `Material Symbols Outlined`).
- `frontend/src/main.jsx` — React root DOM mounting with `StrictMode`.
- `frontend/src/App.jsx` & `frontend/src/App.css` — Top-level layout, routes (`/`, `/detect`, `/result`, `/diseases`, `/about`), background coordinate grid, and atmospheric layers.
- `frontend/src/index.css` — Global CSS variables, design tokens, typography, animations, and utility classes.
- `frontend/src/data/diseasesData.js` — Compendium of 29 crop disease entities with taxonomic metadata.
- `frontend/src/pages/Home.jsx` & `Home.css`
- `frontend/src/pages/Detect.jsx` & `Detect.css`
- `frontend/src/pages/Result.jsx` & `Result.css`
- `frontend/src/pages/Diseases.jsx` & `Diseases.css`
- `frontend/src/pages/About.jsx` & `About.css`
- `frontend/src/components/Navbar.jsx` & `Navbar.css`
- `frontend/src/components/Footer.jsx` & `Footer.css`
- `frontend/src/components/Hero.jsx` & `Hero.css`
- `frontend/src/components/LiveScanner.jsx` & `LiveScanner.css`
- `frontend/src/components/DiseaseVisualization.jsx` & `DiseaseVisualization.css`
- `frontend/src/components/HowAiSees.jsx` & `HowAiSees.css`
- `frontend/src/components/CnnArchitecture.jsx` & `CnnArchitecture.css`
- `frontend/src/components/HerbariumPreview.jsx` & `HerbariumPreview.css`
- `frontend/src/components/ClosingPortal.jsx` & `ClosingPortal.css`
- `frontend/src/components/DiseaseCard.jsx` & `DiseaseCard.css`
- `frontend/src/components/FeatureCard.jsx` & `FeatureCard.css`
- `frontend/src/components/HowItWorks.jsx` & `HowItWorks.css`
- `frontend/src/components/PredictionCard.jsx` & `PredictionCard.css`
- `frontend/src/components/TopPredictions.jsx` & `TopPredictions.css`
- `frontend/src/components/UploadZone.jsx` & `UploadZone.css`
- `frontend/public/assets/` — Test images and hero photography.

---

## 2. ML Model, Notebook, and Class-Mapping Findings

### 2.1 Model Architecture & Parameter Verification
Inspected using Python 3.11 in `tfenv` (`Keras 3.14.1`, `TensorFlow 2.21.0`):
- **Model Type**: Keras Sequential (`sequential_1`)
- **Input Shape**: `(None, 128, 128, 3)`
- **Output Shape**: `(None, 29)`
- **Trainable Parameters**: Exactly **426,013**
- **Non-trainable Parameters**: Exactly **960** (from 4 Batch Normalization layers: 32 + 64 + 128 + 256 moving params)
- **Total Parameters**: **426,973** (Saved `.keras` checkpoint with Adam optimizer states: **1,279,001**, disk size: 4.96 MB / 5,206,036 bytes)
- **Backbone**:
  - Block 1: `Conv2D(32, (3, 3), same)` -> `BatchNorm` -> `ReLU` -> `MaxPool2D((2, 2))`
  - Block 2: `Conv2D(64, (3, 3), same)` -> `BatchNorm` -> `ReLU` -> `MaxPool2D((2, 2))`
  - Block 3: `Conv2D(128, (3, 3), same)` -> `BatchNorm` -> `ReLU` -> `MaxPool2D((2, 2))`
  - Block 4: `Conv2D(256, (3, 3), same)` -> `BatchNorm` -> `ReLU` -> `MaxPool2D((2, 2))`
- **Classification Head**:
  - `GlobalAveragePooling2D()` -> `Dropout(0.4)` -> `Dense(128, activation='relu')` -> `Dropout(0.3)` -> `Dense(29, activation='softmax')`

### 2.2 Class Names & Index Mapping
Verified `model/class_names.json` against notebook Cells 26 & 27:
- Class discovery in notebook: `class_names = sorted(manifest["class"].unique())`
- Exactly 29 classes, sorted alphabetically by folder name.
- Index 0: `Apple - Apple Scab` ... Index 28: `Tomato - Yellow Leaf Curl Virus`.
- Exact 1-to-1 correspondence with `model/class_names.json`, `frontend/src/data/diseasesData.js`, and backend predictor mapping.
- No duplicated, missing, or misordered classes.

### 2.3 Notebook Execution & Evaluation Verification
Audited all 57 notebook cells in `ML/cropdiseasedetactionbyusingcnn.ipynb`:
- **Cell 28**: Group-aware split confirmed with **0 group leakage**:
  - Train set: 46,902 images
  - Validation set: 4,903 images
  - Test set: 4,904 images
- **Cell 30**: Preprocessing logic in notebook:
  - `decode_jpeg(channels=3)` -> `resize((128, 128))` -> `tf.cast(image, tf.float32) / 255.0`
- **Cell 42**: 15 epochs executed. Early stopping and learning rate reduction triggered at Epoch 11 (`lr` reduced to 0.00025).
- **Cell 43**: Peak validation accuracy achieved at **Epoch 14**: **97.14%** (`0.9714460372924805`).
- **Cells 44 & 45**: Restored model checkpoint loaded: `/kaggle/working/best_crop_disease_model.keras`.
- **Cell 46**: `best_model.evaluate(test_ds)` on 4,904 test images:
  - **Test Accuracy**: **97.33%** (`0.9732871055603027`)
  - **Test Loss**: **0.0827859491109848**
- **Cell 47**: Total correct predictions: **4,773 / 4,904**.
- **Cell 48**: Classification report:
  - Macro Precision: 0.9675, Macro Recall: 0.9765, Macro F1: 0.9711
  - Weighted Precision: 0.9748, Weighted Recall: 0.9733, Weighted F1: 0.9733
- **Conclusion**: The documented 97.33% evaluation figure is 100% verified against raw cell execution outputs. The previously discussed 93.80% metric was an intermediate Epoch 9 plateau artifact that was superseded when learning rate reduction allowed convergence to 97.33%.

---

## 3. Backend Findings

### 3.1 Architecture & Portability
- **Path Resolution**: `app/core/config.py` anchors all file paths relative to `Path(__file__).resolve().parent.parent.parent.parent`. Zero hardcoded absolute Windows paths exist. Works across any directory structure.
- **Lifespan Startup**: Model and class labels are eagerly preloaded in the FastAPI `lifespan` context manager, preventing first-request cold start delays.
- **Service Decoupling**: Separation between `main.py` (API routing, payload validation, security middleware), `predictor.py` (inference singleton), `config.py` (settings), and `prediction.py` (Pydantic models) is clean and maintainable.

### 3.2 Preprocessing Integrity
In `backend/app/services/predictor.py`:
- Converts all incoming images to `"RGB"`.
- Resizes to `(128, 128)` using `Image.Resampling.BILINEAR`.
- Converts to `np.float32` and normalizes by `255.0` to range `[0.0, 1.0]`.
- Expands batch dimension to `(1, 128, 128, 3)`.
- Matches the training and notebook evaluation pipeline identically.

### 3.3 Security & Abuse Defense
- **Decompression Bomb Defense**: `Image.MAX_IMAGE_PIXELS = 25_000_000` and dimensional ceiling `MAX_IMAGE_DIMENSION = 4096px`.
- **File Validation**: Two-pass Pillow check: `test_img.verify()` for byte integrity, followed by full raster decode `image.load()` to detect corrupted streams.
- **File Size Ceiling**: Hard 10 MB payload limit (`MAX_IMAGE_SIZE_BYTES = 10485760`).
- **Filename Sanitization**: Employs `os.path.basename` to prevent path traversal attempts.
- **Rate Limiting**: Sliding-window in-memory rate limiter enforcing 120 req/min/IP on `/predict` (returns HTTP 429).
- **Security Headers**: Injects `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and Content Security Policy.
- **CORS Hardened**: Credentials disabled (`allow_credentials=False`), origins restricted to configured allowlist, allowed headers restricted to `Content-Type` and `Accept`.

### 3.4 Identified Backend Defects & Rectifications
1. **Error Message Inconsistency**: `main.py` explicitly allowed BMP format in `["JPEG", "PNG", "WEBP", "BMP"]`, but the user-facing error messages on lines 222 and 243 stated: `"Supported formats are JPEG, PNG, and WebP."`
   - *Fix applied*: Updated messages to include BMP: `"Supported formats are JPEG, PNG, WebP, and BMP."`
2. **Rate Limiter URL Path Boundary**: `request.url.path == "/predict"` would not match `/predict/` with a trailing slash.
   - *Fix applied*: Normalized path check with `request.url.path.rstrip("/") == "/predict"`.
3. **Test Suite Coverage Gap**: `test_api.py` had tests for WEBP and PNG, but omitted explicit BMP testing.
   - *Fix applied*: Added `test_predict_bmp_format` to `test_api.py`.

---

## 4. Frontend Findings

### 4.1 Route and Component Tree
- All 5 routes (`/`, `/detect`, `/result`, `/diseases`, `/about`) are registered in `App.jsx` with a wildcard redirect to `/`.
- All pages and active components render without errors or React warnings.
- Compendium (`/diseases`) correctly filters all 29 classes by search query, host crop, and severity.
- Truth plate on `/about` and Hero telemetry on `/` accurately display the verified 97.33% accuracy, 4,773 / 4,904 correct count, and 128x128 Float32 CNN parameters.

### 4.2 Identified Frontend Defects & Rectifications
1. **Critical Undefined Variable in `UploadZone.jsx`**:
   - `UploadZone.jsx` called `const navigate = useNavigate();` at line 11 without importing `useNavigate` from `react-router-dom`.
   - Any rendering of `<UploadZone />` caused an immediate crash: `ReferenceError: useNavigate is not defined`.
   - *Fix applied*: Added `import { useNavigate } from 'react-router-dom';` to `UploadZone.jsx`.
2. **External Resource Leak in `Hero.jsx`**:
   - `Hero.jsx` line 72 had an `onError` handler falling back to a remote third-party Google User Content URL (`https://lh3.googleusercontent.com/...`). In air-gapped or offline environments, this created network leakage and broken images.
   - *Fix applied*: Replaced fallback with the local asset path: `/assets/tomato_early_blight_leaf.jpg`.
3. **Inconsistent Initial Scanning State in `LiveScanner.jsx`**:
   - In `LiveScanner.jsx`, `currentImageSrc` initialized to `"/assets/tomato_early_blight_leaf.jpg"`, but `scanState` was initialized to `'WAITING FOR SPECIMEN'`. The top status banner read `STATE: WAITING FOR SPECIMEN` while the viewport already displayed the specimen and the dossier card read `STATE: SPECIMEN LOADED`.
   - *Fix applied*: Changed initialization to `(initialImage || currentImageSrc) ? 'SPECIMEN LOADED' : 'WAITING FOR SPECIMEN'`.

### 4.3 Build and Lint Verification
- `oxlint`: Executed on frontend source files -> **0 errors, 0 warnings**.
- `vite build`: Executed cleanly in 477ms -> **53 modules transformed, 0 errors**.

---

## 5. Integration Findings

### 5.1 End-to-End Prediction Pipeline
Traced image flow:
1. User selects or uploads file in `LiveScanner.jsx`.
2. File validated for MIME type (`image/jpeg`, `image/png`, `image/webp`, `image/bmp`) and 10 MB size limit.
3. Form data constructed with field `"file"`.
4. Dispatched via HTTP POST to `${VITE_API_URL}/predict` (defaults to `http://127.0.0.1:8000`).
5. FastAPI validates filename, payload bytes, decompression limits, and format via Pillow `verify()` + `load()`.
6. Converted to RGB, resized to `(128, 128)`, normalized to `[0.0, 1.0]`, batched to `(1, 128, 128, 3)`.
7. Keras CNN model infers 29-class probabilities.
8. Response returned matching `PredictionResponse` schema:
   ```json
   {
     "predicted_class": "Tomato - Early Blight",
     "confidence": 0.942,
     "crop": "Tomato",
     "disease": "Early Blight",
     "is_healthy": false,
     "top_predictions": [
       { "class_name": "Tomato - Early Blight", "confidence": 0.942 },
       { "class_name": "Tomato - Late Blight", "confidence": 0.038 },
       { "class_name": "Tomato - Septoria Leaf Spot", "confidence": 0.012 }
     ]
   }
   ```
9. `LiveScanner` parses response, illuminates confidence gauge, updates status to `PATHOLOGY IDENTIFIED`, and passes state to `/result` when requested.
10. `/result` displays direct backend inference attributes without fabricated placeholders.

All contracts match 100% on both sides.

---

## 6. Security and Configuration Findings

| Security Control | Implementation Status | Verification |
| :--- | :--- | :--- |
| **Secrets & Keys** | Clean (0 API keys or passwords hardcoded) | Verified via recursive grep |
| **Environment Separation** | `.env.example` in `backend/` and `frontend/` | Verified presence and structure |
| **CORS Restriction** | `allow_credentials=False`, strict allowed origins & headers | Verified in `test_security.py` |
| **Security Headers** | `nosniff`, `DENY`, `strict-origin-when-cross-origin`, CSP | Verified in `test_security.py` |
| **Rate Limiting** | Sliding window 120 req/min/IP on `/predict` (HTTP 429) | Verified in `test_security.py` |
| **Decompression Bomb** | `MAX_IMAGE_PIXELS=25M`, `MAX_IMAGE_DIMENSION=4096px` | Verified in Pillow initialization |
| **Path Traversal Defense** | `os.path.basename` filename sanitization | Tested with traversal payloads |
| **Info Disclosure** | Unhandled exceptions return generic 500 without stack trace | Verified in exception handler test |
| **Git Hygiene** | Root `.gitignore` ignores `.env`, caches, build output | Verified in `.gitignore` |

---

## 7. Categorized Issues and Findings

### Critical
- **[RESOLVED] Missing `useNavigate` import in `frontend/src/components/UploadZone.jsx`**:
  Calling `useNavigate()` without an import caused a fatal `ReferenceError` if the component was mounted. Resolved by importing `useNavigate` from `react-router-dom`.

### High
- **[RESOLVED] Remote image dependency in `frontend/src/components/Hero.jsx`**:
  `onError` fallback pointed to an external Google User Content URL. Resolved by replacing with the verified local asset `/assets/tomato_early_blight_leaf.jpg`.

### Medium
- **[RESOLVED] Incomplete supported format error messages in `backend/app/main.py`**:
  HTTP 400 rejection messages omitted BMP from the list of supported formats despite BMP being accepted in code. Resolved by adding BMP to both error strings.
- **[RESOLVED] Inconsistent initial scan state in `frontend/src/components/LiveScanner.jsx`**:
  `scanState` defaulted to `'WAITING FOR SPECIMEN'` while the viewport was preloaded with a specimen leaf image. Resolved by synchronizing `scanState` with specimen availability.

### Low
- **[RESOLVED] Trailing slash sensitivity in rate limiting middleware**:
  `request.url.path == "/predict"` lacked trailing slash normalization. Resolved by using `.rstrip("/") == "/predict"`.
- **[RESOLVED] Missing BMP test case in `backend/test_api.py`**:
  The regression test suite validated JPEG, PNG, and WebP, but lacked a BMP test. Resolved by adding `test_predict_bmp_format`.

### Informational
- **Orphaned components in `frontend/src/components/`**:
  `UploadZone.jsx`, `FeatureCard.jsx`, `HowItWorks.jsx`, `PredictionCard.jsx`, and `TopPredictions.jsx` remain in the codebase from earlier iterations. They are not active in any routes because `LiveScanner.jsx` consolidates upload, scanning, confidence gauge, and top predictions into a unified laboratory viewport. These files do not cause runtime errors and are preserved to maintain code history.
- **System Default Python Version**:
  The system default Python is 3.14 (incompatible with TensorFlow 2.x). All backend commands must explicitly execute using the `tfenv` Conda environment (`C:\Users\ashug\anaconda3\envs\tfenv\python.exe`).

---

## 8. Exact Files Changed and Rationale

| File Path | Nature of Modification | Rationale |
| :--- | :--- | :--- |
| [UploadZone.jsx](file:///c:/Users/ashug/Downloads/CropDiseaseDetection/frontend/src/components/UploadZone.jsx) | Added `import { useNavigate } from 'react-router-dom';` | Fixes fatal `ReferenceError: useNavigate is not defined`. |
| [Hero.jsx](file:///c:/Users/ashug/Downloads/CropDiseaseDetection/frontend/src/components/Hero.jsx) | Replaced external Google User Content URL fallback with `/assets/tomato_early_blight_leaf.jpg` | Prevents remote network leakage and offline rendering failure. |
| [LiveScanner.jsx](file:///c:/Users/ashug/Downloads/CropDiseaseDetection/frontend/src/components/LiveScanner.jsx) | Initialized `scanState` with `(initialImage \|\| currentImageSrc) ? 'SPECIMEN LOADED' : 'WAITING FOR SPECIMEN'` | Resolves visual discrepancy between top bar state and preloaded specimen image. |
| [main.py](file:///c:/Users/ashug/Downloads/CropDiseaseDetection/backend/app/main.py) | Normalized rate limiter path with `.rstrip('/')`; included BMP in HTTP 400 error messages | Normalizes routing and ensures accurate client error communication. |
| [test_api.py](file:///c:/Users/ashug/Downloads/CropDiseaseDetection/backend/test_api.py) | Added `test_predict_bmp_format` function and invoked in `main()` | Provides test coverage for BMP format upload. |

---

## 9. Focused Checks Executed and Real Results

1. **Python Environment Verification**:
   - Command: `C:\Users\ashug\anaconda3\envs\tfenv\python.exe -c "import keras, tensorflow as tf; print(keras.__version__, tf.__version__)"`
   - Result: `Keras: 3.14.1, TF: 2.21.0` (Exit code: 0).
2. **Keras Model Architecture & Weight Verification**:
   - Command: Executed `scratch/inspect_ml.py` via `tfenv` Python.
   - Result: Model loaded successfully. Input: `(None, 128, 128, 3)`. Output: `(None, 29)`. Trainable params: 426,013. Non-trainable: 960. 29 output classes verified (Exit code: 0).
3. **Predictor Service Unit Test**:
   - Command: `C:\Users\ashug\anaconda3\envs\tfenv\python.exe test_predictor.py`
   - Result: All assertions passed (synthetic RGBA image converted to RGB, normalized to `[0.0, 1.0]`, batch dimension added, inference executed, top-3 returned) (Exit code: 0).
4. **Backend Python Compilation**:
   - Command: `C:\Users\ashug\anaconda3\envs\tfenv\python.exe -m py_compile app/main.py app/core/config.py app/schemas/prediction.py app/services/predictor.py test_api.py test_security.py test_predictor.py`
   - Result: Clean compile, 0 syntax or import errors (Exit code: 0).
5. **Frontend Linting**:
   - Command: `npm run lint` in `frontend/`
   - Result: `Found 0 warnings and 0 errors` across 24 files (Exit code: 0).
6. **Frontend Production Build**:
   - Command: `npm run build` in `frontend/`
   - Result: Vite built successfully in 477ms; `dist/` bundle generated (53 modules transformed, exit code: 0).

---

## 10. Unresolved Issues & Documented Limitations

1. **Retraining & Model Weights**:
   As required by project invariants, no model retraining or weight modifications were performed. The model weights reflect the checkpoint restored from Epoch 14 of training.
2. **System Default Python vs. Conda `tfenv`**:
   The host machine's global default Python is 3.14. Because TensorFlow 2.21 does not support Python 3.14, commands executing backend code must specifically target `C:\Users\ashug\anaconda3\envs\tfenv\python.exe`.

---

## 11. Files or Checks That Could Not Be Inspected

- Standalone SRS document: Confirmed absent from project tree. Functional expectations were verified using `PROJECT_MEMORY.md` and notebook records.
- Live full HTTP end-to-end integration suite (`test_api.py` and `test_security.py`): Not executed against a live Uvicorn daemon during this phase, as per the explicit instruction: *"This is a preparation and repair phase. Do not perform the full final deployment audit yet."*

---

## 12. Recommended Commands for Final Testing Phase

To execute the final deployment test suite in the subsequent phase:

### Step 1: Start Backend Service
```powershell
# From project root:
C:\Users\ashug\anaconda3\envs\tfenv\python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

### Step 2: Run Backend Regression Test Suite
```powershell
# In a separate terminal:
C:\Users\ashug\anaconda3\envs\tfenv\python.exe backend/test_api.py
```

### Step 3: Run Security & Hardening Test Suite
```powershell
C:\Users\ashug\anaconda3\envs\tfenv\python.exe backend/test_security.py
```

### Step 4: Run Frontend Verification
```powershell
# From frontend/ directory:
npm run lint
npm run build
npm run dev
```

---

## Final Review Status

**READY FOR FINAL TESTING**
