import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  const [activeSignalIndex, setActiveSignalIndex] = useState(0);

  // Cycle biological life signals across active foliar nodes
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSignalIndex((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="ash-hero-section" aria-label="Specimen Visualization Showcase">
      {/* ── Top Supportive Header & Lab Metadata ─────────────────── */}
      <div className="hero-top-bar">
        <div className="hero-lab-index">
          <span className="hero-pulse-dot" />
          <span className="font-mono text-xs tracking-widest text-ash uppercase">
            SPECIMEN ANALYSIS // REF-ARCHIVE-04
          </span>
          <span className="hero-index-divider">/</span>
          <span className="font-mono text-xs text-ash-muted">
            TAXON: <em className="not-italic text-ash">SOLANUM LYCOPERSICUM</em>
          </span>
        </div>

        <div className="hero-subtle-status font-mono text-xs text-ash-muted">
          <span>OPTICAL RESOLUTION: 128×128px</span>
          <span className="hero-index-divider">|</span>
          <span className="text-primary animate-tech-flicker">INFERENCE CALIBRATED</span>
        </div>
      </div>

      {/* ── CENTRAL VISUAL-FIRST SPECIMEN ARENA ──────────────────── */}
      <div className="hero-specimen-stage">
        {/* Optical Scanning Outer Rings */}
        <div className="specimen-scanning-ring ring-outer animate-ring-cw" aria-hidden="true">
          <span className="ring-tick tick-0">000°</span>
          <span className="ring-tick tick-90">090°</span>
          <span className="ring-tick tick-180">180°</span>
          <span className="ring-tick tick-270">270°</span>
        </div>
        <div className="specimen-scanning-ring ring-inner animate-ring-ccw" aria-hidden="true" />

        {/* Central Specimen Disc / Plate */}
        <div className="specimen-main-plate">
          {/* Specimen Header Ribbon */}
          <div className="specimen-plate-ribbon">
            <div className="ribbon-left">
              <span className="specimen-feed-dot" />
              <span className="font-mono text-xs text-ash tracking-wider">
                LIVE VIEWPORT // CAM-01 [ASH-COMPENSATED]
              </span>
            </div>
            <div className="ribbon-right font-mono text-xs text-ash-muted">
              SPEC-TOM-084 // FOLIAR SCAN 01
            </div>
          </div>

          {/* Core Visual Viewport: Dried Ash Leaf + Traveling Green Signal */}
          <div className="specimen-viewport-wrapper">
            {/* Real Foliar Microscopic Base Layer with Ash/Charcoal Wash */}
            <img
              src="/assets/tomato_early_blight_leaf.jpg"
              alt="Dried foliar specimen with Alternaria solani early blight lesion"
              className="specimen-burned-leaf-img"
              onError={(e) => {
                e.currentTarget.src = "/assets/tomato_early_blight_leaf.jpg";
              }}
            />

            {/* Ash & Necrosis Texture Overlay */}
            <div className="ash-charcoal-wash-overlay" />

            {/* Continuous AI Laser Scanning Line */}
            <div className="specimen-laser-scan-line animate-foliar-scan">
              <span className="laser-tag">ROW SYNC // λ: 532nm</span>
            </div>

            {/* Intricate Botanical Vein Architecture & Green Biological Signal */}
            <svg
              className="specimen-botanical-circuit"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Primary Midrib (Costa) */}
              <path
                d="M250 470 C248 370 252 240 248 40"
                stroke="rgba(154, 163, 173, 0.45)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Secondary Lateral Veins (Dried Foliar Anatomy) */}
              <path d="M249 390 C210 375 160 345 110 320" stroke="rgba(154, 163, 173, 0.3)" strokeWidth="1.4" />
              <path d="M250 375 C295 355 350 330 400 315" stroke="rgba(154, 163, 173, 0.3)" strokeWidth="1.4" />
              <path d="M250 300 C195 270 145 240 90 220"   stroke="rgba(154, 163, 173, 0.3)" strokeWidth="1.4" />
              <path d="M250 280 C305 250 365 230 420 205" stroke="rgba(154, 163, 173, 0.3)" strokeWidth="1.4" />
              <path d="M250 200 C205 170 160 140 120 115" stroke="rgba(154, 163, 173, 0.3)" strokeWidth="1.4" />
              <path d="M250 185 C290 155 345 130 385 105" stroke="rgba(154, 163, 173, 0.3)" strokeWidth="1.4" />

              {/* ── THE GREEN BIOLOGICAL SIGNAL (Life Surviving Through Ash) ── */}
              {/* Signal Path 1: Traveling up midrib into left lesion border */}
              <path
                className={`vein-signal-track ${activeSignalIndex === 0 ? 'signal-active' : ''}`}
                d="M250 440 C249 360 250 300 250 240 C210 225 175 210 140 195"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeDasharray="400"
                strokeDashoffset="400"
              />

              {/* Signal Path 2: Branching right into primary necrotic zone */}
              <path
                className={`vein-signal-track ${activeSignalIndex === 1 ? 'signal-active' : ''}`}
                d="M250 320 C280 290 320 270 355 245 C375 230 395 200 410 180"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeDasharray="400"
                strokeDashoffset="400"
              />

              {/* Signal Path 3: Illuminating apical leaf tip and vascular node */}
              <path
                className={`vein-signal-track ${activeSignalIndex === 2 ? 'signal-active' : ''}`}
                d="M250 260 C251 180 250 120 248 50"
                stroke="var(--secondary)"
                strokeWidth="2"
                strokeDasharray="400"
                strokeDashoffset="400"
              />

              {/* Illuminated Biological Active Nodes */}
              <circle
                cx="140"
                cy="195"
                r="6"
                className={`bio-signal-node ${activeSignalIndex === 0 ? 'node-lit' : ''}`}
                fill="var(--primary)"
              />
              <circle
                cx="355"
                cy="245"
                r="8"
                className={`bio-signal-node ${activeSignalIndex === 1 ? 'node-lit' : ''}`}
                fill="var(--primary)"
              />
              <circle
                cx="248"
                cy="70"
                r="5"
                className={`bio-signal-node ${activeSignalIndex === 2 ? 'node-lit' : ''}`}
                fill="var(--secondary)"
              />
            </svg>

            {/* Microscope Crosshair & Targeting Reticle */}
            <div className="specimen-microscope-reticle" aria-hidden="true">
              <div className="reticle-circle">
                <div className="reticle-dot" />
                <div className="reticle-axis-v" />
                <div className="reticle-axis-h" />
                <div className="reticle-bracket bracket-tl" />
                <div className="reticle-bracket bracket-tr" />
                <div className="reticle-bracket bracket-bl" />
                <div className="reticle-bracket bracket-br" />
              </div>
            </div>

            {/* Pathology Bounding Box */}
            <div className="specimen-bounding-box">
              <div className="bbox-header font-mono text-[9.5px]">
                <span className="text-secondary">[X:42.8 Y:18.4]</span>
                <span className="text-ash-100 font-semibold">CONF: 94.2%</span>
              </div>
              <div className="bbox-tag">
                <span className="bbox-tag-dot" />
                <span className="font-mono text-[9px] tracking-wider text-ash-100 uppercase">
                  EARLY BLIGHT LESION
                </span>
              </div>
            </div>

            {/* Floating Scientific Annotations */}
            <div className="specimen-annotation annot-top-left">
              <span className="annot-line" />
              <div className="annot-content font-mono text-[10px]">
                <span className="text-ash-muted block">PATHOLOGY REGION</span>
                <span className="text-ash font-medium">CONCENTRIC HALO [STAGE II]</span>
              </div>
            </div>

            <div className="specimen-annotation annot-top-right">
              <span className="annot-line" />
              <div className="annot-content font-mono text-[10px]">
                <span className="text-ash-muted block">BIOLOGICAL SIGNAL</span>
                <span className="text-primary font-medium">CHLOROPHYLL DETECTED (0.128)</span>
              </div>
            </div>

            <div className="specimen-annotation annot-bottom-left">
              <span className="annot-line" />
              <div className="annot-content font-mono text-[10px]">
                <span className="text-ash-muted block">SPECTRAL CALIBRATION</span>
                <span className="text-ash font-medium">λ: 532nm HYPERSPECTRAL</span>
              </div>
            </div>

            <div className="specimen-annotation annot-bottom-right">
              <span className="annot-line" />
              <div className="annot-content font-mono text-[10px]">
                <span className="text-ash-muted block">DELTA T / LESION</span>
                <span className="text-secondary font-medium">+1.4°C VASCULAR COMPROMISE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Supporting Editorial Context & CTAs ────────────────── */}
      <div className="hero-editorial-footer">
        <div className="editorial-text-cluster">
          <h1 className="hero-main-title font-headline text-on-surface">
            Forensic Phytopathology &amp; Neural Inference
          </h1>
          <p className="hero-tagline font-body text-ash-muted text-sm md:text-base max-w-2xl mx-auto">
            Autonomous deep learning model calibrated to detect 29 foliar diseases across ash-compromised,
            degraded, and healthy agricultural canopies with 97.33% verified accuracy.
          </p>
        </div>

        {/* Operational Triggers */}
        <div className="hero-action-buttons">
          <Link to="/detect" className="hero-btn-primary">
            <span className="material-symbols-outlined text-[18px]">biotech</span>
            <span>ANALYZE SPECIMEN</span>
            <span className="hero-btn-status-dot" />
          </Link>

          <Link to="/diseases" className="hero-btn-secondary">
            <span>EXPLORE 29 PATHOGENS</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* ── System Telemetry Strip (4 Scientific Readings) ──────── */}
      <div className="hero-telemetry-grid" aria-label="Live System Readings">
        <div className="telemetry-box">
          <div className="telemetry-box-header font-mono text-[10.5px]">
            <span className="telemetry-indicator-dot dot-active" />
            <span className="text-ash-muted">PATHOLOGY CLASSES</span>
          </div>
          <div className="telemetry-value font-mono text-on-surface">
            29 <span className="text-xs text-ash-muted font-normal">DIAGNOSTIC PHENOTYPES</span>
          </div>
          <div className="telemetry-caption font-mono text-[10px] text-ash-muted">
            9 MONITORED CROP FAMILIES
          </div>
        </div>

        <div className="telemetry-box">
          <div className="telemetry-box-header font-mono text-[10.5px]">
            <span className="telemetry-indicator-dot dot-primary" />
            <span className="text-ash-muted">TEST ACCURACY</span>
          </div>
          <div className="telemetry-value font-mono text-primary animate-metric-pulse">
            97.33% <span className="text-xs text-ash-muted font-normal">OFFICIAL</span>
          </div>
          <div className="telemetry-caption font-mono text-[10px] text-ash-muted">
            4,773 / 4,904 CORRECT (GROUP-AWARE)
          </div>
        </div>

        <div className="telemetry-box">
          <div className="telemetry-box-header font-mono text-[10.5px]">
            <span className="telemetry-indicator-dot dot-secondary" />
            <span className="text-ash-muted">INPUT TENSOR</span>
          </div>
          <div className="telemetry-value font-mono text-secondary">
            128 × 128 <span className="text-xs text-ash-muted font-normal">RGB [0.0 - 1.0]</span>
          </div>
          <div className="telemetry-caption font-mono text-[10px] text-ash-muted">
            FLOAT32 NORMALIZED MATRIX
          </div>
        </div>

        <div className="telemetry-box">
          <div className="telemetry-box-header font-mono text-[10.5px]">
            <span className="telemetry-indicator-dot dot-active" />
            <span className="text-ash-muted">CLASSIFIER</span>
          </div>
          <div className="telemetry-value font-mono text-on-surface">
            CNN <span className="text-xs text-primary font-normal">v4.8 ACTIVE</span>
          </div>
          <div className="telemetry-caption font-mono text-[10px] text-ash-muted">
            LATENCY: 28.4ms // 4 CONV BLOCKS
          </div>
        </div>
      </div>
    </section>
  );
}
