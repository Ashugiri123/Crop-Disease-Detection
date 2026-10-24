import { AlertTriangle, CheckCircle2, Cpu } from 'lucide-react';
import './PredictionCard.css';

export default function PredictionCard({ result }) {
  if (!result) return null;

  const { crop, disease, is_healthy, confidence } = result;
  const confidencePercent = Math.round(confidence * 1000) / 10;

  return (
    <div className="prediction-card glass-panel">
      <div className="prediction-header">
        <div className="model-chip">
          <Cpu size={16} className="model-chip-icon" />
          <span>CNN Inferred Diagnostic</span>
        </div>
        <div className={`status-badge ${is_healthy ? 'healthy' : 'diseased'}`}>
          {is_healthy ? (
            <>
              <CheckCircle2 size={16} />
              <span>Healthy Plant</span>
            </>
          ) : (
            <>
              <AlertTriangle size={16} />
              <span>Disease Detected</span>
            </>
          )}
        </div>
      </div>

      <div className="prediction-main-result">
        <span className="crop-label">{crop || "Crop"}</span>
        <h2 className="disease-name">{disease || "Identified Condition"}</h2>
      </div>

      {/* Confidence Gauge */}
      <div className="confidence-metric-container">
        <div className="confidence-label-row">
          <span className="confidence-text">Model Confidence</span>
          <span className="confidence-value">{confidencePercent}%</span>
        </div>
        <div className="confidence-bar-track">
          <div 
            className={`confidence-bar-fill ${is_healthy ? 'fill-healthy' : 'fill-disease'}`}
            style={{ width: `${Math.min(100, Math.max(0, confidencePercent))}%` }}
          />
        </div>
      </div>

      {/* Diagnostic Advice Note */}
      <div className="diagnostic-note">
        <p>
          {is_healthy 
            ? "No visible disease patterns were detected on this leaf specimen. Foliage appears healthy with standard chlorophyll pigmentation."
            : `Foliar symptoms correlate with ${crop} ${disease}. Consult agronomic guidelines for targeted bio-fungicide or cultural containment practices.`
          }
        </p>
      </div>
    </div>
  );
}
