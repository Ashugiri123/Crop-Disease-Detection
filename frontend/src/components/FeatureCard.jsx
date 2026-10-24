import React from 'react';
import './FeatureCard.css';

export default function FeatureCard({ icon: Icon, title, description, badge }) {
  return (
    <div className="feature-card glass-panel">
      <div className="feature-header">
        <div className="feature-icon-box">
          <Icon size={24} className="feature-icon" />
        </div>
        {badge && <span className="feature-badge">{badge}</span>}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      <div className="feature-corner-glow" />
    </div>
  );
}
