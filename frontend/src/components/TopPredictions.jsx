import React from 'react';
import { Layers } from 'lucide-react';
import './TopPredictions.css';

export default function TopPredictions({ predictions }) {
  if (!predictions || predictions.length === 0) return null;

  return (
    <div className="top-predictions-card glass-panel">
      <div className="top-predictions-header">
        <div className="top-pred-title-group">
          <Layers size={18} className="pred-icon" />
          <h3 className="top-pred-heading">Model Class Distribution</h3>
        </div>
        <span className="top-pred-badge">Top {predictions.length} Rankings</span>
      </div>

      <div className="predictions-list">
        {predictions.map((pred, index) => {
          const pct = Math.round(pred.confidence * 1000) / 10;
          return (
            <div key={index} className="pred-row-item">
              <div className="pred-row-info">
                <span className="pred-rank">#{index + 1}</span>
                <span className="pred-class-name">{pred.class_name}</span>
                <span className="pred-pct-text">{pct}%</span>
              </div>
              <div className="pred-bar-track">
                <div 
                  className="pred-bar-fill" 
                  style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
