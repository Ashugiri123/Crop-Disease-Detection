import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detect from './pages/Detect';
import Result from './pages/Result';
import Diseases from './pages/Diseases';
import About from './pages/About';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* ── Layer 0: Laboratory Coordinate Grid Overlay ── */}
      <div className="coordinate-grid-overlay" aria-hidden="true" />

      {/* ── Layer 1: Ash Atmosphere & Botanical Ecology ──────────────── */}
      <div className="ash-atmosphere-container" aria-hidden="true">
        {/* Ambient Haze & Vignette */}
        <div className="ash-vignette" />
        <div className="ash-glow-subtle ash-glow-1" />
        <div className="ash-glow-subtle ash-glow-2" />
        <div className="chlorophyll-distant-glow" />

        {/* Ash Particles & Dust Motes */}
        <div className="ash-particle ash-particle-1" />
        <div className="ash-particle ash-particle-2" />
        <div className="ash-particle ash-particle-3" />
        <div className="ash-particle ash-particle-4" />
        <div className="ash-particle ash-particle-5" />
        <div className="ash-particle ash-particle-6" />
        <div className="ash-particle ash-particle-7" />

        {/* Small Signals of Living Chlorophyll */}
        <div className="ash-particle bio-spore-1" />
        <div className="ash-particle bio-spore-2" />

        {/* Dried / Ash Leaf Silhouettes (Faint Line Art & Botanical Contour) */}
        <div className="burned-foliage-layer foliage-silhouette-1">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 185 C60 160 15 115 10 65 C8 35 32 10 65 15 C95 20 115 50 125 80 C135 110 155 140 185 150 C165 170 135 188 100 185Z"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeDasharray="2 3"
            />
            <path d="M100 185 C100 140 98 90 65 15" stroke="currentColor" strokeWidth="0.6" />
            <path d="M100 150 C80 135 45 115 25 95" stroke="currentColor" strokeWidth="0.4" />
            <path d="M100 120 C120 105 145 95 165 80" stroke="currentColor" strokeWidth="0.4" />
          </svg>
        </div>

        <div className="burned-foliage-layer foliage-silhouette-2">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse
              cx="100"
              cy="100"
              rx="65"
              ry="85"
              transform="rotate(-25 100 100)"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeDasharray="3 4"
            />
            <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────── */}
      <Navbar />

      {/* ── Page Content ───────────────────────────────────────── */}
      <main className="main-content-layout">
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/detect"   element={<Detect />} />
          <Route path="/result"   element={<Result />} />
          <Route path="/diseases" element={<Diseases />} />
          <Route path="/about"    element={<About />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <Footer />
    </BrowserRouter>
  );
}
