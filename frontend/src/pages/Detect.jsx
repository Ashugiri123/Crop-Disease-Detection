import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LiveScanner from '../components/LiveScanner';
import './Detect.css';

export default function Detect() {
  const navigate = useNavigate();
  const [latestInference, setLatestInference] = useState(null);

  const handleComplete = (data) => {
    setLatestInference(data);
  };

  const handleNavigateToResult = () => {
    if (latestInference) {
      navigate('/result', {
        state: {
          imageSrc: latestInference.imageSrc,
          fileName: latestInference.fileName,
          result: latestInference.result,
        }
      });
    }
  };

  return (
    <div className="stitch-detect-page">
      {/* Top Laboratory Header Banner */}
      <div className="detect-header-banner">
        <div className="container-custom">
          <div className="detect-eyebrow font-mono text-xs">
            DIAGNOSTIC WORKBENCH // NEURAL SCANNER 01
          </div>
          <h1 className="detect-title font-headline text-on-surface">
            Precision Foliar Disease Analysis
          </h1>
          <p className="detect-subtitle font-body text-ash-muted">
            Upload a plant leaf photograph or select an indexed laboratory specimen to perform 
            real-time Convolutional Neural Network inference via our FastAPI backend.
          </p>

          {/* Quick dossier jump if analysis is available */}
          {latestInference && (
            <div className="detect-result-banner font-mono text-xs">
              <span className="flex items-center gap-2 text-primary">
                <span className="banner-dot animate-status-pulse" />
                PATHOLOGY CLASSIFIED: {latestInference.result.predicted_class} ({((latestInference.result.confidence || 0) * 100).toFixed(1)}%)
              </span>
              <button
                type="button"
                className="view-dossier-btn text-secondary"
                onClick={handleNavigateToResult}
              >
                OPEN FULL DIAGNOSTIC DOSSIER →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Embedded LiveScanner Stage with Real Inference */}
      <div className="container-custom pt-4">
        <LiveScanner onPredictionComplete={handleComplete} />
      </div>

      {/* Laboratory Imaging Guidelines */}
      <section className="detect-protocols-section">
        <div className="container-custom">
          <div className="protocols-card">
            <div className="protocols-header font-mono text-xs text-primary">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <h3 className="font-headline text-lg text-on-surface">Imaging Standardization Guidelines</h3>
            </div>
            <div className="protocols-grid">
              <div className="protocol-item">
                <span className="protocol-num font-mono">01</span>
                <div>
                  <span className="protocol-name font-mono text-xs text-ash-100">Planar Macro Focus</span>
                  <p className="protocol-desc font-body text-xs text-ash-muted">
                    Position the leaf blade flat against a neutral, high-contrast dark or matte background to isolate edge boundaries.
                  </p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="protocol-num font-mono">02</span>
                <div>
                  <span className="protocol-name font-mono text-xs text-ash-100">Diffuse Illumination</span>
                  <p className="protocol-desc font-body text-xs text-ash-muted">
                    Avoid harsh direct sunlight glare or flash hotspots that wash out subtle chlorotic halos and vascular mycelium.
                  </p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="protocol-num font-mono">03</span>
                <div>
                  <span className="protocol-name font-mono text-xs text-ash-100">Vascular Centering</span>
                  <p className="protocol-desc font-body text-xs text-ash-muted">
                    Capture primary and secondary venation with lesions positioned in the central optical quadrant for accurate 128×128 convolution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
