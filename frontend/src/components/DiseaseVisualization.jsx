import React, { useState } from 'react';
import './DiseaseVisualization.css';

const PATHOLOGY_SAMPLES = [
  {
    id: 'early-blight',
    crop: 'Tomato',
    taxon: 'Solanum lycopersicum',
    disease: 'Early Blight',
    pathogen: 'Alternaria solani',
    severity: 'SEVERE',
    confidence: '94.2%',
    coords: '[X: 42.8, Y: 18.4]',
    lesionType: 'Concentric Ring Necrosis',
    imageSrc: '/assets/tomato_early_blight_leaf.jpg',
    description: 'Distinctive bullseye concentric rings surrounded by a chlorotic yellow halo. Causes progressive defoliation from lower canopy upwards.',
    features: [
      'Concentric target-board rings visible under 10x macro optics',
      'Marginal chlorotic yellow halo indicating toxin diffusion',
      'Accelerated vascular degradation along tertiary venation'
    ]
  },
  {
    id: 'late-blight',
    crop: 'Tomato',
    taxon: 'Solanum lycopersicum',
    disease: 'Late Blight',
    pathogen: 'Phytophthora infestans',
    severity: 'CRITICAL',
    confidence: '96.5%',
    coords: '[X: 68.1, Y: 32.7]',
    lesionType: 'Water-Soaked Necrotic Lesions',
    imageSrc: '/assets/tomato_early_blight_leaf.jpg',
    description: 'Irregular dark-brown to purple water-soaked foliar lesions rapidly expanding during high humidity. White sporangial down on abaxial surfaces.',
    features: [
      'Rapid necrotic tissue collapse across leaf margin',
      'Pale green translucent transition border',
      'Secondary sporulation zones along active veins'
    ]
  },
  {
    id: 'bacterial-spot',
    crop: 'Bell Pepper',
    taxon: 'Capsicum annuum',
    disease: 'Bacterial Spot',
    pathogen: 'Xanthomonas campestris',
    severity: 'SEVERE',
    confidence: '97.1%',
    coords: '[X: 31.5, Y: 52.0]',
    lesionType: 'Pustular Foliar Blisters',
    imageSrc: '/assets/real_bell_pepper_spot.jpg',
    description: 'Small, circular water-soaked spots developing into necrotic brown pustules with greasy appearance and jagged margins.',
    features: [
      'Angular necrotic spots restricted by leaf veins',
      'Raised scab-like pustules on lower leaf epidermis',
      'Chlorotic stippling leading to severe defoliation'
    ]
  },
  {
    id: 'black-rot',
    crop: 'Apple',
    taxon: 'Malus domestica',
    disease: 'Black Rot',
    pathogen: 'Botryosphaeria obtusa',
    severity: 'MODERATE',
    confidence: '91.8%',
    coords: '[X: 55.4, Y: 44.2]',
    lesionType: 'Frogeye Leaf Spot Necrosis',
    imageSrc: '/assets/hero_field.jpg',
    description: 'Circular lesions with dark brown margins and light tan centers resembling a frogeye pattern, containing tiny black pycnidia bodies.',
    features: [
      'Concentric tan center bounded by reddish-brown perimeter',
      'Microscopic pycnidia fungal bodies embedded in necrotic tissue',
      'Interveinal leaf tissue degradation without initial vascular rupture'
    ]
  },
  {
    id: 'septoria-spot',
    crop: 'Tomato',
    taxon: 'Solanum lycopersicum',
    disease: 'Septoria Leaf Spot',
    pathogen: 'Septoria lycopersici',
    severity: 'SEVERE',
    confidence: '95.4%',
    coords: '[X: 47.9, Y: 61.3]',
    lesionType: 'Circular Pycnidial Punctures',
    imageSrc: '/assets/tomato_leaf.jpg',
    description: 'Numerous small circular spots with grayish-white centers and dark brown borders. Black speck-like pycnidia clearly visible within lesion centers.',
    features: [
      '1-3mm discrete circular foliar lesions',
      'Distinctive gray-white ash centers with dark margins',
      'Extensive chlorosis merging adjacent lesions into necrotic collapse'
    ]
  }
];

export default function DiseaseVisualization() {
  const [selectedSample, setSelectedSample] = useState(PATHOLOGY_SAMPLES[0]);

  return (
    <section className="disease-vis-section" id="disease-visualization" aria-label="Pathology Morphology Visualization">
      <div className="container-custom">
        {/* Section Header */}
        <div className="disease-vis-header">
          <div className="font-mono text-xs text-primary tracking-widest uppercase mb-1">
            SECTION // 03 PATHOLOGY MORPHOLOGY
          </div>
          <h2 className="disease-vis-title font-headline text-on-surface">
            Foliar Necrosis &amp; Symptom Classification
          </h2>
          <p className="disease-vis-subtitle font-body text-ash-muted">
            Microscopic leaf pathology visualization isolating chlorotic halos, fungal sporulation margins, 
            and vascular lesions with targeted convolutional feature detection.
          </p>
        </div>

        {/* Pathology Selector Strip */}
        <div className="disease-vis-tabs">
          {PATHOLOGY_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className={`disease-tab-btn ${selectedSample.id === sample.id ? 'tab-active' : ''}`}
              onClick={() => setSelectedSample(sample)}
            >
              <span className="tab-crop font-mono text-[9px] text-ash-muted">{sample.crop.toUpperCase()}</span>
              <span className="tab-disease font-body text-xs font-semibold">{sample.disease}</span>
              <span className="tab-severity font-mono text-[8.5px]">{sample.severity}</span>
            </button>
          ))}
        </div>

        {/* Dual-Column Macroscopic Pathology Stage */}
        <div className="disease-vis-stage-grid">
          {/* Left: Grayscale Specimen with Green Targeted Pathology Lens */}
          <div className="vis-plate-col">
            <div className="vis-plate-frame">
              {/* Header Ticker */}
              <div className="vis-plate-topbar font-mono text-xs">
                <span className="flex items-center gap-2 text-primary">
                  <span className="vis-pulse-dot" />
                  OPTICAL LENS // MACRO 10X
                </span>
                <span className="text-ash-muted">{selectedSample.coords}</span>
              </div>

              {/* Viewport Image with Ash Desaturation & Targeted Green Highlight */}
              <div className="vis-viewport">
                <img
                  src={selectedSample.imageSrc}
                  alt={`${selectedSample.crop} ${selectedSample.disease}`}
                  className="vis-foliar-img"
                  onError={(e) => { e.currentTarget.src = '/assets/tomato_early_blight_leaf.jpg'; }}
                />

                {/* Ash Wash Layer */}
                <div className="vis-ash-overlay" />

                {/* Laser Sweep */}
                <div className="vis-laser-beam animate-foliar-scan" />

                {/* Targeted Biological Lesion Indicator (Green / Lime Active Signal) */}
                <div className="vis-lesion-target-box">
                  <div className="vis-target-corners">
                    <span className="corner c-tl" />
                    <span className="corner c-tr" />
                    <span className="corner c-bl" />
                    <span className="corner c-br" />
                  </div>
                  <div className="vis-target-label font-mono text-[9px]">
                    <span className="text-secondary">{selectedSample.lesionType.toUpperCase()}</span>
                    <span className="text-primary font-bold">CONF: {selectedSample.confidence}</span>
                  </div>
                </div>

                {/* Footnote telemetry */}
                <div className="vis-footer-coords font-mono text-[9px]">
                  <span>VASCULAR CHANNEL: DEGRADED</span>
                  <span>SPECTRAL BAND: 532nm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Pathogen Dossier & Agronomic Features */}
          <div className="vis-dossier-col">
            <div className="vis-dossier-card">
              <div className="vis-dossier-header font-mono text-xs">
                <span className="text-ash-muted">PATHOGEN DOSSIER</span>
                <span className="text-primary font-bold">{selectedSample.confidence} NEURAL MATCH</span>
              </div>

              <div className="vis-dossier-body">
                <div className="dossier-taxon-block">
                  <span className="font-mono text-[10px] text-ash-muted uppercase tracking-wider">Host Specimen</span>
                  <div className="font-headline text-lg text-on-surface">{selectedSample.taxon}</div>
                  <span className="font-body text-xs text-ash-muted italic">{selectedSample.crop} Foliar Blade</span>
                </div>

                <div className="dossier-pathogen-block">
                  <span className="font-mono text-[10px] text-ash-muted uppercase tracking-wider">Identified Pathogen</span>
                  <div className="font-headline text-xl text-secondary italic">{selectedSample.pathogen}</div>
                  <div className="font-mono text-xs text-primary font-semibold tracking-wide mt-0.5">
                    {selectedSample.disease.toUpperCase()} [{selectedSample.severity}]
                  </div>
                </div>

                <p className="dossier-narrative font-body text-sm text-ash-200">
                  {selectedSample.description}
                </p>

                {/* Key Diagnostic Features */}
                <div className="dossier-features-list">
                  <span className="font-mono text-[10px] text-ash-muted uppercase tracking-wider block mb-2">
                    Diagnostic Optical Biomarkers
                  </span>
                  {selectedSample.features.map((feature, idx) => (
                    <div key={idx} className="feature-item font-mono text-xs text-ash-muted">
                      <span className="feature-bullet text-primary">▪</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
