import React, { useState } from 'react';
import './HowAiSees.css';

const CNN_STAGES = [
  {
    step: '01',
    title: 'RAW LEAF',
    subtitle: 'Photometric Normalization',
    tensor: '128 × 128 × 3 [FLOAT32]',
    kernel: 'INPUT SENSOR FEED',
    description: 'Raw photographic image is decoded into RGB float32 matrix normalized to [0.0, 1.0], neutralizing ambient lighting variation.',
    filterType: 'raw',
    activeRegionText: 'RGB Channels Aligned'
  },
  {
    step: '02',
    title: 'EDGE STRUCTURES',
    subtitle: 'Block 1 Convolution',
    tensor: '128 × 128 × 32 [CONV2D]',
    kernel: '32 × (3×3 KERNELS)',
    description: 'First convolutional layer isolates high-frequency spatial gradients, leaf contour boundaries, and primary midrib venation.',
    filterType: 'edges',
    activeRegionText: 'Vein Gradient Discontinuities'
  },
  {
    step: '03',
    title: 'TEXTURE FEATURES',
    subtitle: 'Block 2 Convolution',
    tensor: '64 × 64 × 64 [MAXPOOL]',
    kernel: '64 × (3×3 KERNELS)',
    description: 'Intermediate spatial reduction captures micro-texture, chlorotic epidermal stippling, and intercellular fungal hyphae expansion.',
    filterType: 'texture',
    activeRegionText: 'Chlorosis Texture Hotspots'
  },
  {
    step: '04',
    title: 'LESION FEATURES',
    subtitle: 'Block 3 & 4 Convolution',
    tensor: '16 × 16 × 256 [RESIDUAL]',
    kernel: '256 × (3×3 KERNELS)',
    description: 'Deep hierarchical filters activate specifically on concentric bullseye rings, necrotic punctures, and spore pustule geometries.',
    filterType: 'lesions',
    activeRegionText: 'Necrotic Concentric Targets'
  },
  {
    step: '05',
    title: 'DEEP FEATURES',
    subtitle: 'Global Pooling & Dense',
    tensor: '1 × 128 [DENSE VECTOR]',
    kernel: 'GLOBAL AVG POOLING',
    description: 'Spatial dimensions collapse into an invariant 128-dimensional latent vector representing generalized phytopathological disease markers.',
    filterType: 'latent',
    activeRegionText: 'Inference Latent Embedding'
  },
  {
    step: '06',
    title: 'CLASSIFICATION',
    subtitle: 'Softmax Activation',
    tensor: '1 × 29 [PROBABILITY]',
    kernel: '29-CLASS SOFTMAX',
    description: 'Calibrated Softmax head outputs confidence distribution across all 29 validated crop disease phenotypes.',
    filterType: 'output',
    activeRegionText: 'Alternaria solani (94.2%)'
  }
];

export default function HowAiSees() {
  const [activeStage, setActiveStage] = useState(0);
  const current = CNN_STAGES[activeStage];

  return (
    <section className="how-ai-sees-section" id="how-ai-sees" aria-label="Visual CNN Progression">
      <div className="container-custom">
        {/* Section Header */}
        <div className="how-header">
          <div className="font-mono text-xs text-secondary tracking-widest uppercase mb-1">
            SECTION // 04 NEURAL PROGRESSION
          </div>
          <h2 className="how-title font-headline text-on-surface">
            How The Neural Network Sees Foliage
          </h2>
          <p className="how-subtitle font-body text-ash-muted">
            From raw photographic pixels to calibrated botanical disease diagnosis: tracing spatial feature 
            transformations through convolutional filters and latent tensor projections.
          </p>
        </div>

        {/* 6 Stage Navigation Pill Bar */}
        <div className="how-stage-pills" role="tablist">
          {CNN_STAGES.map((stage, idx) => (
            <button
              key={stage.step}
              type="button"
              role="tab"
              aria-selected={activeStage === idx}
              className={`stage-pill-btn ${activeStage === idx ? 'pill-active' : ''}`}
              onClick={() => setActiveStage(idx)}
            >
              <span className="pill-step font-mono text-[9px] text-ash-muted">{stage.step}</span>
              <span className="pill-name font-mono text-xs font-semibold">{stage.title}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Feature Map Stage Arena */}
        <div className="how-stage-arena">
          {/* Left: Grayscale / Ash Feature Map Display with Green Active Hotspots */}
          <div className="arena-visual-plate">
            <div className="plate-top-bar font-mono text-xs">
              <span className="flex items-center gap-2 text-ash">
                <span className="dot-stage-indicator" />
                FEATURE MAP TENSOR // STAGE {current.step}
              </span>
              <span className="text-secondary font-semibold">{current.tensor}</span>
            </div>

            <div className="feature-map-viewport">
              {/* Synthetic Feature Map Visualizer using Grayscale + Green Activity */}
              <div className={`feature-map-canvas filter-${current.filterType}`}>
                {/* Background Specimen Base */}
                <img
                  src="/assets/tomato_early_blight_leaf.jpg"
                  alt="Feature map representation"
                  className="feature-base-img"
                  onError={(e) => { e.currentTarget.src = '/assets/tomato_early_blight_leaf.jpg'; }}
                />

                {/* Algorithmic Convolution Kernel Overlay Matrix */}
                <div className="kernel-grid-overlay" />

                {/* Green Biological Signal Hotspot (Active Region) */}
                <div className={`active-feature-halo halo-${current.filterType}`}>
                  <span className="halo-ring ring-1" />
                  <span className="halo-ring ring-2" />
                  <span className="halo-center-dot" />
                </div>

                {/* Laser scan line overlay */}
                <div className="feature-scan-line animate-foliar-scan" />

                {/* Corner Coordinates */}
                <div className="feature-coords-overlay font-mono text-[9px]">
                  <span>RESIDUAL ACTIVATION: {current.activeRegionText}</span>
                  <span>OP: {current.kernel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Technical Explanation & Mathematical Tensor Specs */}
          <div className="arena-specs-card">
            <div className="specs-card-header font-mono text-xs">
              <span className="text-ash-muted">LAYER ARCHITECTURE SPECIFICATION</span>
              <span className="text-primary font-bold">KERNEL RESOLUTION</span>
            </div>

            <div className="specs-card-body">
              <div>
                <span className="font-mono text-[10px] text-ash-muted uppercase tracking-wider block">Stage Description</span>
                <h3 className="font-headline text-xl text-on-surface mt-1">{current.title}: {current.subtitle}</h3>
              </div>

              <p className="font-body text-sm text-ash-200 leading-relaxed">
                {current.description}
              </p>

              {/* Mathematical Tensor Specifications Grid */}
              <div className="tensor-spec-grid font-mono text-xs">
                <div className="spec-row">
                  <span className="text-ash-muted">TENSOR SHAPE:</span>
                  <span className="text-secondary font-bold">{current.tensor}</span>
                </div>
                <div className="spec-row">
                  <span className="text-ash-muted">KERNEL OPERATOR:</span>
                  <span className="text-ash font-medium">{current.kernel}</span>
                </div>
                <div className="spec-row">
                  <span className="text-ash-muted">NON-LINEARITY:</span>
                  <span className="text-ash font-medium">{activeStage === 5 ? 'Softmax (Probabilistic)' : 'ReLU + BatchNorm'}</span>
                </div>
                <div className="spec-row">
                  <span className="text-ash-muted">ACTIVE TARGET:</span>
                  <span className="text-primary font-semibold">{current.activeRegionText}</span>
                </div>
              </div>

              {/* Interactive Step-Through Action Buttons */}
              <div className="specs-action-bar">
                <button
                  type="button"
                  className="step-btn prev-btn font-mono text-xs text-ash-muted"
                  disabled={activeStage === 0}
                  onClick={() => setActiveStage((prev) => Math.max(0, prev - 1))}
                >
                  ← PREVIOUS STAGE
                </button>
                <button
                  type="button"
                  className="step-btn next-btn font-mono text-xs text-primary"
                  disabled={activeStage === CNN_STAGES.length - 1}
                  onClick={() => setActiveStage((prev) => Math.min(CNN_STAGES.length - 1, prev + 1))}
                >
                  NEXT CONVOLUTION →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
