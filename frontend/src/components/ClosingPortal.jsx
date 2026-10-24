import React from 'react';
import { Link } from 'react-router-dom';
import './ClosingPortal.css';

export default function ClosingPortal() {
  return (
    <section className="stitch-closing-portal-section">
      <div className="closing-portal-card">
        {/* Backlit Atmospheric Bio-Light */}
        <div className="portal-ambient-light" />

        <div className="portal-content-wrap">
          <div className="portal-eco-icon-box">
            <span className="material-symbols-outlined text-[24px]">eco</span>
          </div>

          <h2 className="portal-title">
            YOUR LEAF HAS A STORY.<br />
            <span className="portal-title-italic">LET AI READ IT.</span>
          </h2>

          <p className="portal-desc">
            Deploy deep convolutional intelligence directly inside your greenhouse, orchard, or experimental field plot.
          </p>

          <div className="portal-cta-group">
            <Link to="/detect" className="portal-primary-btn">
              <span className="material-symbols-outlined text-[20px]">center_focus_strong</span>
              <span>ANALYZE A LEAF NOW</span>
            </Link>

            <Link to="/diseases" className="portal-secondary-btn">
              <span>EXPLORE 29 PHYTOPATHOGENS</span>
            </Link>
          </div>

          <p className="portal-compatibility-note">
            Compatible with standard smartphone cameras &amp; agricultural UAV sensor feeds.
          </p>
        </div>
      </div>
    </section>
  );
}
