import React from 'react';
import Hero from '../components/Hero';
import LiveScanner from '../components/LiveScanner';
import DiseaseVisualization from '../components/DiseaseVisualization';
import HowAiSees from '../components/HowAiSees';
import CnnArchitecture from '../components/CnnArchitecture';
import HerbariumPreview from '../components/HerbariumPreview';
import ClosingPortal from '../components/ClosingPortal';

export default function Home() {
  return (
    <div className="stitch-home-page">
      {/* 1. Hero Specimen & System Telemetry Arena */}
      <Hero />

      {/* 2. Live Leaf Pathology Scanner Stage */}
      <div className="container-custom pt-12 pb-6">
        <div className="font-mono text-xs text-primary tracking-widest uppercase mb-1">
          SECTION // 02 TELEMETRY LENS
        </div>
        <h2 className="font-headline text-3xl md:text-4xl text-on-surface">
          From Foliar Lens to Actionable Diagnosis
        </h2>
        <p className="font-body text-ash-muted text-sm md:text-base max-w-xl mt-2 mb-6">
          Continuous neural scan segmentation identifies chlorotic halos, concentric rings,
          and vascular mycelium directly from agricultural leaf images.
        </p>
        <LiveScanner />
      </div>

      {/* 3. Macroscopic Disease Visualization */}
      <DiseaseVisualization />

      {/* 4. How AI Sees Foliage (6-Stage CNN Feature Map Progression) */}
      <HowAiSees />

      {/* 5. CNN Feature Map & Deep Topology Architecture */}
      <CnnArchitecture />

      {/* 6. Indexed Reference Herbarium (Botanical Pathology Archive) */}
      <HerbariumPreview />

      {/* 7. Final Specimen Laboratory CTA Portal */}
      <ClosingPortal />
    </div>
  );
}
