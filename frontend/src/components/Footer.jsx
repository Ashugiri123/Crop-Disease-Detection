import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const CURRENT_YEAR = 2026;

export default function Footer() {
  return (
    <footer className="stitch-footer" id="footer">
      <div className="stitch-footer-inner">
        {/* Top Row: Identity & Navigation Links */}
        <div className="footer-top-row">
          <div>
            <span className="footer-brand-title">CropGuard AI</span>
            <span className="footer-brand-subtitle">Phytopathology Telemetry Network</span>
          </div>

          <nav className="footer-links-nav">
            <Link to="/detect">SYSTEM TELEMETRY</Link>
            <Link to="/diseases">QUARANTINE PROTOCOLS</Link>
            <Link to="/about">NEURAL REPOSITORIES</Link>
            <Link to="/diseases">DISEASE COMPENDIUM</Link>
            <Link to="/about">LAB SPECIFICATIONS</Link>
          </nav>
        </div>

        {/* Bottom Row: Mandatory Telemetry Text & Lab Coordinates */}
        <div className="footer-bottom-row">
          <p className="footer-coords-text">
            &copy; {CURRENT_YEAR} CropGuard AI Pathological Telemetry Labs. 
            All field diagnostics synthesized via Neural Specimen Inference Engine v4.8. 
            Reference Grid Coordinates: 45°26'12"N 122°40'55"W. 
            For agronomic research and computational phytopathology diagnostics.
          </p>

          <div className="footer-health-status">
            <span className="health-dot animate-status-pulse" />
            <span className="animate-tech-flicker">SYSTEM HEALTH: NOMINAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
