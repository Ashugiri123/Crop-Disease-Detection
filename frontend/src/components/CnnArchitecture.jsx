import React from 'react';
import './CnnArchitecture.css';

export default function CnnArchitecture() {
  const modelNodes = [
    {
      step: "01",
      icon: "filter_center_focus",
      label: "INPUT TENSOR",
      shape: "128 × 128 RGB",
      meta: "Float32 [0.0 - 1.0]",
      type: "input"
    },
    {
      step: "02",
      icon: "layers",
      label: "CONV BLOCK 1",
      shape: "128×128 × 32",
      meta: "32 Filters (3×3) + BN",
      type: "conv"
    },
    {
      step: "03",
      icon: "layers",
      label: "CONV BLOCK 2",
      shape: "64×64 × 64",
      meta: "64 Filters (3×3) + BN",
      type: "conv"
    },
    {
      step: "04",
      icon: "grid_4x4",
      label: "CONV BLOCK 3",
      shape: "32×32 × 128",
      meta: "128 Filters (3×3) + BN",
      type: "conv"
    },
    {
      step: "05",
      icon: "grid_4x4",
      label: "CONV BLOCK 4",
      shape: "16×16 × 256",
      meta: "256 Filters (3×3) + BN",
      type: "conv"
    },
    {
      step: "06",
      icon: "compress",
      label: "GLOBAL AVG POOL",
      shape: "1 × 256 VECTOR",
      meta: "Spatial Collapse + 0.4 Drop",
      type: "pool"
    },
    {
      step: "07",
      icon: "account_tree",
      label: "DENSE 128",
      shape: "1 × 128 VECTOR",
      meta: "ReLU + 0.3 Dropout",
      type: "dense"
    },
    {
      step: "08",
      icon: "data_object",
      label: "SOFTMAX HEAD",
      shape: "1 × 29 CLASSES",
      meta: "Probability Distribution",
      type: "output"
    }
  ];

  return (
    <section className="cnn-arch-section" id="cnn-architecture" aria-label="CNN Architecture Visualization">
      <div className="container-custom">
        <div className="arch-plate-card">
          {/* Header Block */}
          <div className="arch-header-row">
            <div>
              <div className="font-mono text-xs text-primary tracking-widest uppercase mb-1">
                SECTION // 05 DEEP TOPOLOGY
              </div>
              <h2 className="arch-title font-headline text-on-surface">
                Convolutional Foliar Inference Engine
              </h2>
              <p className="arch-desc font-body text-ash-muted">
                Sequential Convolutional Neural Network with 4 hierarchically expanding residual filter blocks,
                Global Average Pooling, and a calibrated 29-class Softmax classification head.
              </p>
            </div>

            {/* Live Benchmark Chips */}
            <div className="arch-benchmarks font-mono text-xs">
              <div className="benchmark-box">
                <span className="text-ash-muted block">VALIDATION LOSS</span>
                <span className="text-primary font-bold text-sm">0.0828</span>
              </div>
              <div className="benchmark-box">
                <span className="text-ash-muted block">INFERENCE LATENCY</span>
                <span className="text-secondary font-bold text-sm">28.4 ms</span>
              </div>
              <div className="benchmark-box">
                <span className="text-ash-muted block">TOTAL PARAMETERS</span>
                <span className="text-on-surface font-bold text-sm">426,973</span>
              </div>
            </div>
          </div>

          {/* Sequential Convolution Flow Diagram */}
          <div className="arch-diagram-flow">
            <div className="flow-inner-grid">
              {modelNodes.map((node, idx) => (
                <div key={idx} className={`arch-node-card node-${node.type}`}>
                  <div className="node-step font-mono text-[9px] text-ash-muted">
                    <span>STEP {node.step}</span>
                    <span className="material-symbols-outlined text-[16px]">{node.icon}</span>
                  </div>
                  <div className="node-label font-mono text-xs font-semibold text-on-surface mt-1.5">
                    {node.label}
                  </div>
                  <div className="node-shape font-mono text-xs text-secondary mt-1">
                    {node.shape}
                  </div>
                  <div className="node-meta font-mono text-[9.5px] text-ash-muted mt-0.5">
                    {node.meta}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training & Hardware Specifications Strip */}
          <div className="arch-specs-strip font-mono text-xs">
            <div className="spec-metric">
              <span className="text-ash-muted block">OPTIMIZER</span>
              <span className="text-on-surface font-medium">Adam (lr=0.001 → 0.00025)</span>
            </div>
            <div className="spec-metric">
              <span className="text-ash-muted block">GROUP-AWARE SPLIT</span>
              <span className="text-on-surface font-medium">4,904 Test (0 Leakage)</span>
            </div>
            <div className="spec-metric">
              <span className="text-ash-muted block">VERIFIED TEST ACCURACY</span>
              <span className="text-primary font-bold">97.33% (4,773 / 4,904)</span>
            </div>
            <div className="spec-metric">
              <span className="text-ash-muted block">MODEL RUNTIME</span>
              <span className="text-secondary font-bold">Keras 3 / TensorFlow 2.21</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
