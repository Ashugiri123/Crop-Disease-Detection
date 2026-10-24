import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import './DiseaseCard.css';

export default function DiseaseCard({ item }) {
  const { crop, latinCrop, disease, pathogen, isHealthy, severity, specId, description, id } = item;

  return (
    <div className={`disease-item-card ${isHealthy ? 'is-healthy-card' : 'is-disease-card'}`}>
      <div className="card-top-row font-mono text-[9.5px]">
        <div className="flex items-center gap-2">
          <span className="crop-tag text-primary">{crop.toUpperCase()}</span>
          {latinCrop && <span className="latin-tag text-ash-400">({latinCrop})</span>}
        </div>
        <span className="spec-id-badge text-ash-muted">{specId || `#${id}`}</span>
      </div>

      <div className="card-mid-body">
        <h4 className="disease-title font-headline">{disease}</h4>
        {pathogen && (
          <span className="pathogen-italic font-headline text-secondary italic text-xs block mt-0.5">
            {pathogen}
          </span>
        )}
        {description && (
          <p className="disease-desc-text font-body text-xs text-ash-muted mt-2">
            {description}
          </p>
        )}
      </div>

      <div className="card-bottom-row">
        <div className={`status-pill font-mono text-[10px] ${isHealthy ? 'pill-healthy' : 'pill-diseased'}`}>
          {isHealthy ? (
            <>
              <CheckCircle2 size={12} />
              <span>ASYMPTOMATIC BASELINE</span>
            </>
          ) : (
            <>
              <AlertCircle size={12} />
              <span>{severity ? `${severity} PATHOLOGY` : 'DISEASE TARGET'}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
