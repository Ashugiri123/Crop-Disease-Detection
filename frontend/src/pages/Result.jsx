import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Result.css';

export default function Result() {
  const location = useLocation();

  // Fallback demo specimen shown only if navigated directly without an active scan session
  const defaultState = {
    imageSrc: "/assets/tomato_early_blight_leaf.jpg",
    fallbackSrc: "/assets/tomato_early_blight_leaf.jpg",
    fileName: "DEMO_BENCHMARK_SPECIMEN.jpg",
    isDemo: true,
    result: {
      predicted_class: "Tomato - Early Blight",
      crop: "Tomato",
      disease: "Early Blight",
      is_healthy: false,
      confidence: 0.942,
      top_predictions: [
        { class_name: "Tomato - Early Blight", confidence: 0.942 },
        { class_name: "Tomato - Late Blight", confidence: 0.038 },
        { class_name: "Tomato - Septoria Leaf Spot", confidence: 0.012 },
        { class_name: "Tomato - Healthy", confidence: 0.008 }
      ]
    }
  };

  const isLiveSession = Boolean(location.state?.result);
  const currentData = location.state || defaultState;
  const { imageSrc, fallbackSrc, fileName, result } = currentData;
  const confidenceVal = Number(result?.confidence) || 0;
  const activeSegments = Math.round(confidenceVal * 10);

  // Guarantee top predictions are sorted descending by confidence
  const sortedTopPredictions = result?.top_predictions
    ? [...result.top_predictions].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    : [];

  return (
    <div className="stitch-result-page">
      <div className="container-custom">
        {/* Navigation Breadcrumb Bar */}
        <div className="result-top-breadcrumb">
          <Link to="/detect" className="breadcrumb-back-btn" aria-label="Return to live scanner workbench">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>BACK TO SCANNER WORKBENCH</span>
          </Link>
          <div className="result-verified-badge">
            <span className="badge-dot animate-status-pulse" />
            <span className="animate-tech-flicker">
              {isLiveSession
                ? "FASTAPI INFERENCE CERTIFIED // REAL SPECIMEN DATA"
                : "ARCHIVAL BENCHMARK SPECIMEN // DIRECT ACCESS"}
            </span>
          </div>
        </div>

        {/* Demo Specimen Notice if Direct Access */}
        {!isLiveSession && (
          <div className="demo-notice-banner font-mono text-xs mb-4">
            <span className="material-symbols-outlined text-[16px] text-primary">info</span>
            <span className="flex-1">
              You are viewing an archival demonstration dossier. To run real CNN inference on your own leaf specimen:
            </span>
            <Link to="/detect" className="demo-notice-cta underline font-semibold text-primary">
              LAUNCH LIVE SCANNER
            </Link>
          </div>
        )}

        {/* 2-Column Diagnostic Dossier Layout */}
        <div className="result-dossier-grid">
          {/* Left Column: Specimen Reticle Plate */}
          <div className="result-specimen-col">
            <div className="result-plate-frame">
              <div className="result-plate-header font-mono text-xs">
                <span className="plate-id text-primary truncate max-w-[240px]">
                  SPECIMEN DOSSIER // {fileName || "ANALYZED_LEAF.JPG"}
                </span>
                <span className="plate-coords text-ash-muted">CHLOROPHYLL SCANNER [CAL-OK]</span>
              </div>

              <div className="result-viewport-box">
                <img 
                  src={imageSrc} 
                  alt={`Examined plant leaf specimen: ${result?.crop || 'Crop'} with ${result?.disease || 'Pathology'}`} 
                  className="result-viewport-img"
                  onError={(e) => { e.currentTarget.src = fallbackSrc || "/assets/tomato_early_blight_leaf.jpg"; }}
                />

                {/* Reticle Lines & Crosshairs */}
                <div className="result-reticle-overlay">
                  <div className="reticle-target-box">
                    <span className="bracket-tl" />
                    <span className="bracket-tr" />
                    <span className="bracket-bl" />
                    <span className="bracket-br" />
                    <div className="target-tag font-mono text-[9.5px]">
                      {result?.is_healthy ? "ASYMPTOMATIC TISSUE" : `${result?.disease?.toUpperCase()} TARGET`}
                    </div>
                  </div>
                </div>

                <div className="result-viewport-footer-coords font-mono text-[9px]">
                  <span>RES: 128 × 128 (NORMALIZED RGB)</span>
                  <span className="text-secondary font-bold">CONF: {(confidenceVal * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="result-plate-actions">
                <Link to="/detect" className="result-analyze-another-cta">
                  <span className="material-symbols-outlined text-[18px]">biotech</span>
                  <span>ANALYZE ANOTHER LEAF SPECIMEN</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Pathology Report & Agronomy Actions */}
          <div className="result-diagnostic-col">
            {/* Main Pathology Report Card */}
            <div className="pathology-report-card">
              <div className="pathology-card-header font-mono text-xs">
                <span className="text-ash-muted">TAXON DIAGNOSTIC REPORT</span>
                <span className="conf-top-val text-secondary font-bold">
                  CONFIDENCE {(confidenceVal * 100).toFixed(1)}%
                </span>
              </div>

              <div className="pathology-meta-block">
                <span className="meta-block-label font-mono text-[10px] text-ash-muted uppercase tracking-wider">Identified Crop Host</span>
                <h3 className="meta-taxon-title font-headline text-2xl text-on-surface">{result?.crop || "Unknown Taxon"}</h3>
                <span className="meta-crop-variety font-body text-xs text-ash-muted italic">Botanical Foliage Specimen</span>
              </div>

              <div className="pathology-pathogen-block">
                <span className="meta-block-label font-mono text-[10px] text-ash-muted uppercase tracking-wider">Diagnostic Classification</span>
                <h4 className="meta-disease-italic font-headline text-2xl text-secondary italic">
                  {result?.is_healthy ? "Healthy Plant Specimen" : (result?.disease || "Undetermined")}
                </h4>
                <span className="meta-stage-tag font-mono text-xs text-primary font-semibold tracking-wider">
                  {result?.is_healthy ? "NOMINAL // NO PATHOGEN DETECTED" : `${result?.disease?.toUpperCase()} DETECTED`}
                </span>
              </div>

              {/* Segmented Confidence Bar Gauge */}
              <div className="confidence-gauge-wrap">
                <div className="gauge-header font-mono text-xs">
                  <span className="text-ash-muted">NEURAL CONFIDENCE GAUGE</span>
                  <span className="gauge-pct-mono text-primary font-bold">
                    {(confidenceVal * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="gauge-segmented-bar">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`gauge-segment ${
                        i < activeSegments 
                          ? (result?.is_healthy ? 'seg-healthy' : 'seg-diseased') 
                          : 'seg-inactive'
                      }`} 
                    />
                  ))}
                </div>
              </div>

              {/* Quarantine Status Pill */}
              <div className={`quarantine-status-pill ${result?.is_healthy ? 'status-nominal' : 'status-danger'}`}>
                <div className="status-label-group font-mono text-xs">
                  <span className="status-pulse-light animate-status-pulse" />
                  <span className="status-text-bold uppercase tracking-wider">
                    {result?.is_healthy ? "Nominal Foliar Baseline" : "Active Infection Detected"}
                  </span>
                </div>
                <span className="status-level-tag font-mono text-[10px] text-ash-muted">
                  {result?.is_healthy ? "LEVEL 0 // CLEAR" : "BIOHAZARD LVL 2"}
                </span>
              </div>
            </div>

            {/* Differential Probabilities Breakdown */}
            <div className="differential-dist-card">
              <span className="differential-heading font-mono text-[10px] text-ash-muted uppercase tracking-wider block mb-3">
                Differential Diagnostic Distribution (Backend Output)
              </span>

              <div className="differential-items-list space-y-2.5 font-mono text-xs">
                {sortedTopPredictions.map((item, idx) => {
                  const pct = ((item.confidence || 0) * 100).toFixed(1);
                  const isTop = idx === 0;
                  return (
                    <div key={idx} className="diff-item-row">
                      <div className="diff-item-info flex justify-between mb-1">
                        <span className={isTop ? 'diff-name-top text-on-surface font-semibold' : 'diff-name-sub text-ash-muted'}>
                          {item.class_name}
                        </span>
                        <span className={`diff-pct-mono ${isTop ? 'text-primary font-bold' : 'text-ash-muted'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="diff-bar-track">
                        <div 
                          className={`diff-bar-fill ${isTop ? 'fill-top' : 'fill-sub'}`}
                          style={{ width: `${Math.min(100, Math.max(2, parseFloat(pct)))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Agronomic Guidance with explicit Educational Disclaimer */}
              <div className="agronomy-rec-footer">
                <div className="edu-disclaimer-badge font-mono text-[9px] text-secondary tracking-wider uppercase mb-2">
                  [GENERAL EDUCATIONAL REFERENCE — NOT A CNN PREDICTION]
                </div>
                <p className="rec-text-small font-body text-xs text-ash-muted leading-relaxed mb-3">
                  {result?.is_healthy 
                    ? "Routine agronomic protocol: Maintain balanced irrigation and weekly foliar surveillance. No chemical fungicide intervention required."
                    : `Pathology management protocol: Quarantine affected foliage immediately. Consult local agricultural extension guidelines for approved ${result?.crop || 'crop'} controls and organic copper-based bio-fungicides.`}
                </p>
                <Link to="/diseases" className="rec-link-cta font-mono text-xs text-primary flex items-center gap-1">
                  <span>BROWSE COMPENDIUM FOR {result?.crop?.toUpperCase() || 'CROPS'}</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

