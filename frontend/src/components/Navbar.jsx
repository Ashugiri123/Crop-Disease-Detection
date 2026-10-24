import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="stitch-navbar">
      <div className="stitch-navbar-inner">
        {/* Brand Anchor */}
        <Link to="/" className="stitch-brand" aria-label="CropGuard AI Home">
          <div className="stitch-brand-icon">
            <span className="material-symbols-outlined text-[20px]">biotech</span>
          </div>
          <div className="stitch-brand-text">
            <span className="stitch-brand-title">CropGuard AI</span>
            <span className="stitch-brand-subtitle">Phytopathology Labs</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="stitch-desktop-nav" aria-label="Main Navigation">
          <NavLink
            to="/"
            className={({ isActive }) => `stitch-nav-link ${isActive ? 'active' : ''}`}
            end
          >
            HOME
          </NavLink>
          <NavLink
            to="/detect"
            className={({ isActive }) => `stitch-nav-link ${isActive ? 'active' : ''}`}
          >
            DETECT
          </NavLink>
          <NavLink
            to="/diseases"
            className={({ isActive }) => `stitch-nav-link ${isActive ? 'active' : ''}`}
          >
            DISEASE EXPLORER
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `stitch-nav-link ${isActive ? 'active' : ''}`}
          >
            AI ARCHITECTURE
          </NavLink>
        </nav>

        {/* Trailing Action Hub */}
        <div className="stitch-nav-actions">
          <div className="stitch-system-status">
            <span className="status-dot animate-status-pulse" />
            <span className="animate-tech-flicker">AI SYSTEM ONLINE</span>
          </div>

          <Link to="/detect" className="stitch-cta-btn">
            <span className="material-symbols-outlined text-[17px]">terminal</span>
            <span>ANALYZE SPECIMEN</span>
          </Link>

          <button
            type="button"
            className="stitch-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="stitch-mobile-drawer">
          <nav className="stitch-mobile-nav">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>HOME</NavLink>
            <NavLink to="/detect" onClick={() => setMobileMenuOpen(false)}>DETECT SPECIMEN</NavLink>
            <NavLink to="/diseases" onClick={() => setMobileMenuOpen(false)}>DISEASE EXPLORER</NavLink>
            <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>AI ARCHITECTURE &amp; ABOUT</NavLink>
            <Link to="/detect" className="stitch-mobile-cta" onClick={() => setMobileMenuOpen(false)}>
              <span className="material-symbols-outlined">terminal</span>
              <span>ANALYZE SPECIMEN</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
