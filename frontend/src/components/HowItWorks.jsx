import React from 'react';
import './HowItWorks.css';

export default function HowItWorks() {
  const stages = [
    {
      step: "01",
      icon: "photo_camera",
      title: "CAPTURE",
      description: "Upload high-resolution foliar specimen via camera or autonomous agricultural UAV drone sensor feeds.",
      footer: "INPUT: RAW JPG / PNG / WEBP"
    },
    {
      step: "02",
      icon: "grain",
      title: "ANALYZE",
      description: "128×128 RGB tensor extraction and convolution across deep spatial filters and high-frequency edge kernels.",
      footer: "KERNEL: 3×3 MULTI-LAYER CONV"
    },
    {
      step: "03",
      icon: "troubleshoot",
      title: "DETECT",
      description: "Neural recognition of chlorosis, necrosis, and fungal pathogen morphology against 29 validated phytopathogens.",
      footer: "SOFTMAX: 29 PHENOTYPE CLASSES"
    },
    {
      step: "04",
      icon: "prescriptions",
      title: "UNDERSTAND",
      description: "Actionable agronomic treatment protocols and quarantine severity grading delivered in <450ms.",
      footer: "OUTPUT: AGRONOMY REMEDIATION"
    }
  ];

  return (
    <section className="stitch-pipeline-section" id="pipeline">
      <div className="pipeline-header-block">
        <div className="pipeline-eyebrow">NEURAL INFERENCE PROCESS</div>
        <h2 className="pipeline-title">HOW CROPGUARD DECODES FOLIAR PATHOLOGY.</h2>
        <p className="pipeline-desc">
          From raw sensor capture to validated biological countermeasure in less than 450 milliseconds 
          through our four-stage inference pipeline.
        </p>
      </div>

      <div className="pipeline-cards-grid">
        {stages.map((stage, idx) => (
          <div key={idx} className="pipeline-stage-card">
            <div>
              <div className="stage-top-row">
                <span className="stage-step-num">{stage.step}</span>
                <span className="material-symbols-outlined stage-icon">{stage.icon}</span>
              </div>
              <h3 className="stage-card-title">{stage.title}</h3>
              <p className="stage-card-desc">{stage.description}</p>
            </div>
            <div className="stage-card-footer">{stage.footer}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
