import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LiveScanner.css';

// Botanical Linnaean mapping for crops
const BOTANICAL_NAMES = {
  "Tomato": { taxon: "Solanum lycopersicum", variety: "Commercial Tomato Foliar Specimen" },
  "Apple": { taxon: "Malus domestica", variety: "Orchard Pomaceous Specimen" },
  "Bell Pepper": { taxon: "Capsicum annuum", variety: "Solanaceae Sweet Pepper Foliage" },
  "Cherry": { taxon: "Prunus avium", variety: "Rosaceae Stone Fruit Specimen" },
  "Corn (Maize)": { taxon: "Zea mays", variety: "Gramineae Cereal Crop Foliar Blade" },
  "Grape": { taxon: "Vitis vinifera", variety: "Vitaceae Vine Foliage" },
  "Peach": { taxon: "Prunus persica", variety: "Rosaceae Drupe Foliage" },
  "Potato": { taxon: "Solanum tuberosum", variety: "Tuberous Foliar Specimen" },
  "Strawberry": { taxon: "Fragaria × ananassa", variety: "Stoloniferous Foliar Leaf" },
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function LiveScanner({ initialImage = null, onPredictionComplete = null }) {
  const navigate = useNavigate();
  const [currentImageSrc, setCurrentImageSrc] = useState(
    initialImage || "/assets/tomato_early_blight_leaf.jpg"
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [reticleOn, setReticleOn] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  
  // Stitch Analysis States: WAITING FOR SPECIMEN | SPECIMEN LOADED | SCANNING | ANALYZING | PATHOLOGY IDENTIFIED | READY
  const [scanState, setScanState] = useState((initialImage || currentImageSrc) ? 'SPECIMEN LOADED' : 'WAITING FOR SPECIMEN');

  const fileInputRef = useRef(null);

  // Diagnostic state received directly from FastAPI /predict (null until inference is executed)
  const [prediction, setPrediction] = useState(null);

  const sampleLeaves = [
    {
      name: "Tomato Foliar Spot (Field Sample)",
      path: "/assets/tomato_early_blight_leaf.jpg",
    },
    {
      name: "Asymptomatic Foliar Control",
      path: "/assets/tomato_leaf.jpg",
    },
    {
      name: "Foliar Lesion Specimen (Field Sample)",
      path: "/assets/real_bell_pepper_spot.jpg",
    }
  ];


  // Handle uploaded files
  const processFile = (file) => {
    if (!file) return;
    const validFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    if (!validFormats.includes(file.type)) {
      setErrorMsg("Format invalid. Supported formats: JPEG, PNG, WEBP, BMP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Payload exceeds 10 MB maximum capacity.");
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCurrentImageSrc(objectUrl);
    setPrediction(null); // Clear previous prediction for fresh analysis
    setScanState('SPECIMEN LOADED');
  };

  // Remove current image
  const handleRemoveImage = () => {
    setCurrentImageSrc(null);
    setSelectedFile(null);
    setPrediction(null);
    setErrorMsg(null);
    setScanState('WAITING FOR SPECIMEN');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Run real CNN inference via FastAPI POST /predict
  const executeInference = async () => {
    if (!currentImageSrc) {
      setErrorMsg("No foliar specimen loaded. Please upload or select a leaf.");
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setScanState('SCANNING');

    // Progression through scanning -> analyzing states
    const scanTimer = setTimeout(() => {
      setScanState('ANALYZING');
    }, 500);

    // Timeout safeguard against hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      let fileToUpload = selectedFile;

      // If no local file object but an image URL is active, convert to blob
      if (!fileToUpload) {
        const response = await fetch(currentImageSrc);
        const blob = await response.blob();
        fileToUpload = new File([blob], "specimen_leaf.jpg", { type: blob.type || "image/jpeg" });
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);

      const apiResponse = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      clearTimeout(scanTimer);

      if (!apiResponse.ok) {
        const errJson = await apiResponse.json().catch(() => null);
        throw new Error(errJson?.detail || `Inference error (HTTP ${apiResponse.status})`);
      }

      const resultData = await apiResponse.json();
      setPrediction(resultData);
      setScanState('PATHOLOGY IDENTIFIED');

      if (onPredictionComplete) {
        onPredictionComplete({
          result: resultData,
          imageSrc: currentImageSrc,
          fileName: fileToUpload.name,
        });
      }
    } catch (err) {
      clearTimeout(timeoutId);
      clearTimeout(scanTimer);
      setScanState('READY');
      console.error("Inference execution failed:", err);
      if (err.name === 'AbortError') {
        setErrorMsg("Inference request timed out after 15 seconds. Please retry.");
      } else {
        setErrorMsg(
          err.message?.includes("Failed to fetch")
            ? `FastAPI service unreachable at ${API_BASE_URL}. Verify the server is running.`
            : err.message
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const botanicalInfo = prediction ? (BOTANICAL_NAMES[prediction?.crop] || {
    taxon: `${prediction?.crop || "Plantae"} sp.`,
    variety: "Agricultural Foliar Specimen"
  }) : null;

  // Ensure top predictions are sorted descending by confidence
  const sortedPredictions = prediction?.top_predictions
    ? [...prediction.top_predictions].sort((a, b) => b.confidence - a.confidence)
    : [];

  return (
    <div className="live-scanner-container" id="live-scanner">
      {/* ── Stage Grid ─────────────────────────────────────────── */}
      <div className="scanner-stage-grid">
        {/* Left Column: Viewport Specimen Frame */}
        <div className="scanner-viewport-col">
          <div className="scanner-frame-card">
            {/* Top Monogram Ribbon */}
            <div className="scanner-top-bar font-mono text-xs">
              <div className="flex items-center gap-2 text-primary">
                <span className="scanner-status-dot animate-status-pulse" />
                <span>STATE: {scanState}</span>
              </div>
              <span className="text-ash-muted">OPTICAL FEED: 128×128 (FLOAT32)</span>
            </div>

            {/* Specimen Viewport */}
            <div
              className={`scanner-viewport-lens ${dragActive ? 'drag-target-active' : ''} ${!currentImageSrc ? 'viewport-empty' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              {currentImageSrc ? (
                <>
                  <img
                    src={currentImageSrc}
                    alt="Selected plant leaf specimen"
                    className="scanner-leaf-img"
                    onError={(e) => { e.currentTarget.src = "/assets/tomato_early_blight_leaf.jpg"; }}
                  />

                  {/* Ash Charcoal Wash Overlay */}
                  <div className="scanner-ash-wash" />

                  {/* Continuous Laser Scanning Beam (accelerates during active inference) */}
                  <div className={`scanner-laser-beam ${isLoading ? 'laser-fast' : 'animate-foliar-scan'}`}>
                    <div className="laser-status-tag font-mono text-[8.5px]">
                      {isLoading ? "SYNCHRONIZING TENSOR CONVOLUTION" : "CALIBRATED OPTICAL ROW"}
                    </div>
                  </div>

                  {/* Targeting Crosshair & Bounding Box */}
                  {reticleOn && (
                    <div className="scanner-reticle-overlay">
                      <div className="reticle-box">
                        <span className="b-corner bc-tl" />
                        <span className="b-corner bc-tr" />
                        <span className="b-corner bc-bl" />
                        <span className="b-corner bc-br" />
                        <div className="reticle-label font-mono text-[9px]">
                          <span className="text-secondary">[LOC: X:42.8 Y:18.4]</span>
                          <span className="text-primary font-bold">
                            {prediction ? `${((prediction.confidence || 0) * 100).toFixed(1)}% CONF` : "AWAITING INFERENCE"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="empty-viewport-cta"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                >
                  <span className="material-symbols-outlined text-[40px] text-ash-400">cloud_upload</span>
                  <span className="font-mono text-xs text-ash-200 mt-2">CLICK OR DRAG A LEAF SPECIMEN HERE</span>
                  <span className="font-mono text-[10px] text-ash-400 mt-1">JPEG, PNG, WEBP, BMP UP TO 10 MB</span>
                </div>
              )}

              {/* Drag & Drop Overlay */}
              {dragActive && (
                <div className="drag-drop-curtain font-mono text-xs">
                  <span>RELEASE SPECIMEN FILE TO LOAD</span>
                </div>
              )}

              {/* Bottom Viewport Coordinate Footer */}
              <div className="viewport-coords-footer font-mono text-[9px]">
                <span>λ: 532nm HYPERSPECTRAL</span>
                <span className="text-secondary">FPS: 60.0 // EXPOSURE: AUTO</span>
              </div>
            </div>

            {/* Controls Bar & State Trigger */}
            <div className="scanner-controls-bar">
              <div className="controls-left">
                <button
                  type="button"
                  className={`ctrl-toggle-btn font-mono text-xs ${reticleOn ? 'ctrl-active' : ''}`}
                  onClick={() => setReticleOn(!reticleOn)}
                  aria-label="Toggle reticle overlay"
                >
                  RETICLE {reticleOn ? 'ON' : 'OFF'}
                </button>

                <button
                  type="button"
                  className="ctrl-upload-btn font-mono text-xs"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload specimen file"
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  <span>{currentImageSrc ? 'CHANGE FILE' : 'UPLOAD FILE'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/bmp"
                  style={{ display: 'none' }}
                  onChange={(e) => processFile(e.target.files?.[0])}
                />

                {currentImageSrc && (
                  <button
                    type="button"
                    className="ctrl-remove-btn font-mono text-xs text-ash-muted"
                    onClick={handleRemoveImage}
                    title="Remove specimen image"
                  >
                    REMOVE
                  </button>
                )}
              </div>

              <button
                type="button"
                className="scanner-infer-trigger-btn font-mono text-xs"
                onClick={executeInference}
                disabled={isLoading || !currentImageSrc}
                aria-label="Run Convolutional Neural Network inference"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isLoading ? 'sync' : 'biotech'}
                </span>
                <span>{isLoading ? 'INFERRING...' : 'RUN CNN INFERENCE'}</span>
              </button>
            </div>

            {/* Sample Selector Bar */}
            <div className="scanner-sample-picker">
              <span className="font-mono text-[10px] text-ash-muted uppercase tracking-wider block mb-2">
                Select Calibrated Test Specimen:
              </span>
              <div className="sample-buttons-row">
                {sampleLeaves.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`sample-leaf-btn font-mono text-xs ${currentImageSrc === sample.path ? 'sample-active' : ''}`}
                    onClick={() => {
                      setCurrentImageSrc(sample.path);
                      setSelectedFile(null);
                      setPrediction(null);
                      setErrorMsg(null);
                      setScanState('SPECIMEN LOADED');
                    }}
                  >
                    <span>{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="scanner-error-banner font-mono text-xs">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span className="flex-1">{errorMsg}</span>
                <button
                  type="button"
                  className="retry-btn font-mono text-xs font-semibold underline"
                  onClick={executeInference}
                >
                  RETRY
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Telemetry Rail & Diagnostic Report */}
        <div className="scanner-telemetry-col">
          {prediction ? (
            <div className="telemetry-dossier-card">
              <div className="dossier-card-header font-mono text-xs">
                <span className="text-ash-muted">TAXON DIAGNOSTIC REPORT</span>
                <span className="text-secondary font-bold">
                  CONFIDENCE {((prediction.confidence || 0) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="dossier-card-body">
                {/* Host Crop */}
                <div className="host-taxon-box">
                  <span className="font-mono text-[10px] text-ash-muted uppercase tracking-wider">Target Host Specimen</span>
                  <div className="font-headline text-xl text-on-surface mt-0.5">{botanicalInfo?.taxon}</div>
                  <span className="font-body text-xs text-ash-muted italic">{botanicalInfo?.variety}</span>
                </div>

                {/* Pathogen Classification */}
                <div className="pathogen-id-box">
                  <span className="font-mono text-[10px] text-ash-muted uppercase tracking-wider">Neural Classification</span>
                  <div className="font-headline text-2xl text-secondary italic mt-0.5">
                    {prediction.disease}
                  </div>
                  <div className="font-mono text-xs text-primary font-semibold tracking-wider mt-0.5">
                    {prediction.predicted_class?.toUpperCase()}
                  </div>
                </div>

                {/* 10-Segment Neural Confidence Gauge */}
                <div className="confidence-gauge-box">
                  <div className="flex justify-between font-mono text-xs mb-1.5">
                    <span className="text-ash-muted">NEURAL CONFIDENCE GAUGE</span>
                    <span className="text-primary font-bold">
                      {((prediction.confidence || 0) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="segmented-gauge-track">
                    {[...Array(10)].map((_, i) => {
                      const isLit = i < Math.round((prediction.confidence || 0) * 10);
                      return (
                        <div
                          key={i}
                          className={`gauge-segment ${isLit ? 'segment-lit' : ''}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Pathological Quarantine Status */}
                <div className={`status-alert-pill ${prediction.is_healthy ? 'pill-healthy' : 'pill-diseased'}`}>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="alert-dot" />
                    <span className="font-semibold uppercase tracking-wider">
                      {prediction.is_healthy ? 'ASYMPTOMATIC // VIGOROUS' : 'ACTIVE INFECTION IDENTIFIED'}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-ash-muted">
                    {prediction.is_healthy ? 'BIOHAZARD: 0' : 'BIOHAZARD: LVL 2'}
                  </span>
                </div>

                {/* Differential Diagnostic Probabilities Breakdown */}
                <div className="differential-dist-box">
                  <span className="font-mono text-[10px] text-ash-muted uppercase tracking-wider block mb-3">
                    Differential Diagnostic Distribution
                  </span>
                  <div className="space-y-2.5 font-mono text-xs">
                    {sortedPredictions.map((item, idx) => (
                      <div key={idx} className="diff-item">
                        <div className="flex justify-between mb-1">
                          <span className={idx === 0 ? 'text-on-surface font-medium' : 'text-ash-muted'}>
                            {item.class_name}
                          </span>
                          <span className={idx === 0 ? 'text-primary font-bold' : 'text-ash-muted'}>
                            {(item.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="diff-bar-bg">
                          <div
                            className={`diff-bar-fill ${idx === 0 ? 'fill-primary' : 'fill-muted'}`}
                            style={{ width: `${Math.max(2, item.confidence * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Link to Full Dossier Page */}
                <div className="dossier-actions-row">
                  <button
                    type="button"
                    className="open-dossier-btn font-mono text-xs"
                    onClick={() => {
                      navigate('/result', {
                        state: {
                          imageSrc: currentImageSrc,
                          fileName: selectedFile?.name || "specimen_leaf.jpg",
                          result: prediction
                        }
                      });
                    }}
                  >
                    <span>OPEN FULL LABORATORY DOSSIER</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="telemetry-dossier-card awaiting-card">
              <div className="dossier-card-header font-mono text-xs">
                <span className="text-ash-muted">TAXON DIAGNOSTIC REPORT</span>
                <span className="text-ash-400">STATE: SPECIMEN LOADED</span>
              </div>
              <div className="awaiting-body">
                <span className="material-symbols-outlined text-[48px] text-ash-500">biotech</span>
                <h3 className="font-headline text-lg text-on-surface mt-3">Specimen Awaiting Inference</h3>
                <p className="font-body text-xs text-ash-muted max-w-xs text-center mt-1">
                  Click &ldquo;RUN CNN INFERENCE&rdquo; to send the normalized 128×128 image to the FastAPI model endpoint.
                </p>
                <button
                  type="button"
                  className="awaiting-cta-btn font-mono text-xs"
                  onClick={executeInference}
                  disabled={isLoading}
                >
                  RUN INFERENCE NOW
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
