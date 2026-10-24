import React from 'react';
import CnnArchitecture from '../components/CnnArchitecture';
import './About.css';

export default function About() {
  const telemetrySpecs = [
    { label: "NEURAL ARCHITECTURE", val: "Sequential 4-Block Convolutional Neural Network" },
    { label: "INPUT TENSOR SHAPE", val: "(1, 128, 128, 3) RGB Normalized [0.0, 1.0]" },
    { label: "TARGET OUTPUT CLASSES", val: "29 Foliar Phytopathological Categories" },
    { label: "TRAINABLE PARAMETERS", val: "426,013 Parameters (~4.96 MB Checkpoint)" },
    { label: "ML RUNTIME / ENGINE", val: "TensorFlow 2.21 / Keras 3.14 (Python 3.11 tfenv)" },
    { label: "REST SERVICE FRAMEWORK", val: "FastAPI + Uvicorn ASGI Server" },
    { label: "DATA LEAKAGE PROTOCOL", val: "Strict Group-Aware Leaf Split (0 Overlap)" },
    { label: "VERIFIED TEST ACCURACY", val: "97.33% (4,773 of 4,904 Test Specimens Correct)" }
  ];

  return (
    <div className="stitch-about-page">
      <div className="container-custom">
        {/* Header Block */}
        <div className="about-header-block">
          <div className="about-eyebrow">LABORATORY METHODOLOGY &amp; ARCHITECTURE</div>
          <h1 className="about-title">Computational Phytopathology Specifications</h1>
          <p className="about-desc">
            CropGuard AI operates at the intersection of classical field botany, computational plant pathology, 
            and high-throughput computer vision.
          </p>
        </div>

        {/* Evaluation Truth Card */}
        <div className="eval-truth-plate">
          <div className="eval-plate-header">
            <span className="eval-cert-badge">
              <span className="cert-dot pulse-glow" />
              OFFICIAL VERIFIED EVALUATION // RESTORED EPOCH 14 CHECKPOINT
            </span>
            <span className="eval-timestamp">ISO-COMPLIANT DATA MANIFEST</span>
          </div>

          <div className="eval-plate-grid">
            <div className="eval-stat-box">
              <span className="eval-stat-label">OFFICIAL TEST ACCURACY</span>
              <span className="eval-stat-number text-primary">97.33%</span>
              <span className="eval-stat-desc">4,773 / 4,904 Correct Predictions</span>
            </div>
            <div className="eval-stat-box">
              <span className="eval-stat-label">SPARSE CATEGORICAL LOSS</span>
              <span className="eval-stat-number text-secondary">0.0828</span>
              <span className="eval-stat-desc">Cross-Entropy Test Loss</span>
            </div>
            <div className="eval-stat-box">
              <span className="eval-stat-label">WEIGHTED PRECISION</span>
              <span className="eval-stat-number text-primary">97.48%</span>
              <span className="eval-stat-desc">Macro Precision: 96.75%</span>
            </div>
            <div className="eval-stat-box">
              <span className="eval-stat-label">WEIGHTED F1-SCORE</span>
              <span className="eval-stat-number text-secondary">97.33%</span>
              <span className="eval-stat-desc">Macro Recall: 97.65%</span>
            </div>
          </div>
        </div>

        {/* Architectural Topology Visualizer Component */}
        <div className="about-arch-embed">
          <CnnArchitecture />
        </div>

        {/* Scientific Narrative: Data Leakage Elimination */}
        <div className="methodology-story-grid">
          <div className="story-panel">
            <div className="story-panel-header">
              <span className="material-symbols-outlined text-primary">shield</span>
              <h3 className="story-title">Group-Aware Data Split Verification</h3>
            </div>
            <p className="story-para">
              Public agricultural datasets frequently suffer from severe <strong>group data leakage</strong>, where augmented, 
              cropped, or multi-frame variations of the identical parent leaf are distributed across training and evaluation splits.
            </p>
            <p className="story-para">
              During diagnosis, an original PlantVillage benchmark showed over 8,500 validation images sharing parent image groups with training. 
              CropGuard AI enforced a strict group-aware logical split tracked via <code>split_manifest.csv</code>:
            </p>
            <ul className="story-metrics-list">
              <li><strong>Training Partition:</strong> 46,902 leaf specimens</li>
              <li><strong>Validation Partition:</strong> 4,903 leaf specimens</li>
              <li><strong>Test Partition:</strong> 4,904 leaf specimens</li>
              <li><strong>Inter-Split Group Overlap:</strong> Exactly 0 groups</li>
            </ul>
          </div>

          <div className="story-panel">
            <div className="story-panel-header">
              <span className="material-symbols-outlined text-secondary">memory</span>
              <h3 className="story-title">Inference Pipeline &amp; Edge Deployment</h3>
            </div>
            <p className="story-para">
              The deep neural classifier processes 3-channel RGB tensors resized to 128×128 pixels. 
              Pixel intensities are normalized to <code>[0.0, 1.0]</code>.
            </p>
            <p className="story-para">
              A 4-block Conv2D backbone (32, 64, 128, 256 filters) with Batch Normalization, ReLU activations, 
              and MaxPooling extracts micro-lesion contours, necrotic margins, and fungal mycelium structures.
            </p>
            <p className="story-para">
              A GlobalAveragePooling2D head with dual dropout regularization (0.4 and 0.3) feeds into a 29-unit 
              Dense softmax activation layer, producing a full probability distribution in under 28 milliseconds.
            </p>
          </div>
        </div>

        {/* Specifications Table Matrix */}
        <div className="specs-matrix-card">
          <div className="specs-matrix-header">
            <span className="material-symbols-outlined text-primary">table_chart</span>
            <h3 className="specs-matrix-title">Laboratory Telemetry Specification Register</h3>
          </div>
          <div className="specs-table-rows">
            {telemetrySpecs.map((item, idx) => (
              <div key={idx} className="spec-table-row">
                <span className="spec-reg-label">{item.label}</span>
                <span className="spec-reg-val">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
