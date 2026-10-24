import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DISEASES_DATA, CROPS_LIST } from '../data/diseasesData';
import './Diseases.css';

export default function Diseases() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("ALL"); // ALL | SEVERE | MODERATE | NOMINAL

  const filteredDiseases = useMemo(() => {
    return DISEASES_DATA.filter((item) => {
      // Crop Filter
      if (selectedCrop !== "All" && item.crop !== selectedCrop) {
        return false;
      }

      // Severity Filter
      if (severityFilter !== "ALL" && item.severity !== severityFilter) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.fullName.toLowerCase().includes(query);
        const matchesPathogen = item.pathogen.toLowerCase().includes(query);
        const matchesCrop = item.crop.toLowerCase().includes(query);
        const matchesLatin = item.latinCrop.toLowerCase().includes(query);
        return matchesName || matchesPathogen || matchesCrop || matchesLatin;
      }

      return true;
    });
  }, [searchQuery, selectedCrop, severityFilter]);

  return (
    <div className="stitch-diseases-page">
      <div className="container-custom">
        {/* Header Block */}
        <div className="diseases-header-block">
          <div className="diseases-eyebrow">INDEXED REFERENCE HERBARIUM</div>
          <h1 className="diseases-title">Monitored Phytological Compendium</h1>
          <p className="diseases-desc">
            Complete taxonomic compendium of all 29 foliar pathogen phenotypes and healthy baselines 
            recognized by the CropGuard AI neural network.
          </p>
        </div>

        {/* Filter & Search Matrix */}
        <div className="diseases-controls-panel">
          {/* Search Input Bar */}
          <div className="search-slot">
            <span className="material-symbols-outlined search-slot-icon">search</span>
            <input 
              type="text" 
              className="search-slot-input"
              placeholder="Filter by pathogen, host species, or lesion phenotype..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Severity Status Filters */}
          <div className="severity-filter-toggles">
            {["ALL", "SEVERE", "MODERATE", "NOMINAL"].map((sev) => (
              <button
                key={sev}
                type="button"
                className={`severity-btn ${severityFilter === sev ? 'active' : ''}`}
                onClick={() => setSeverityFilter(sev)}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Crop Pills Scroll Row */}
        <div className="crop-pills-wrap">
          <div className="crop-pills-row">
            {CROPS_LIST.map((cropName) => (
              <button
                key={cropName}
                type="button"
                className={`crop-pill ${selectedCrop === cropName ? 'active' : ''}`}
                onClick={() => setSelectedCrop(cropName)}
              >
                {cropName}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Meta Information */}
        <div className="catalog-meta-strip">
          <span className="catalog-counter">
            INDEXED SPECIMENS: <strong className="counter-highlight">{filteredDiseases.length}</strong> / 29 MONITORED CLASSES
          </span>
          {(selectedCrop !== "All" || severityFilter !== "ALL" || searchQuery) && (
            <button 
              type="button" 
              className="catalog-reset-btn"
              onClick={() => { setSelectedCrop("All"); setSeverityFilter("ALL"); setSearchQuery(""); }}
            >
              RESET TAXONOMIC FILTERS
            </button>
          )}
        </div>

        {/* 29 Herbarium Cards Grid */}
        <div className="herbarium-catalog-grid">
          {filteredDiseases.map((item) => (
            <div key={item.id} className="catalog-herbarium-card">
              <div className="card-top-tag">
                <span className="card-latin-crop">{item.latinCrop}</span>
                <span className="card-spec-id">{item.specId}</span>
              </div>

              <div className="card-main-content">
                <h3 className="card-pathogen-name">{item.pathogen}</h3>
                <span className="card-common-disease">{item.fullName.toUpperCase()}</span>
                <p className="card-description">{item.description}</p>
              </div>

              <div className="card-footer-row">
                <div className={`card-severity-pill sev-${item.severity.toLowerCase()}`}>
                  <span className="sev-dot" />
                  <span>{item.severity}</span>
                </div>
                <Link to="/detect" className="card-test-btn">
                  <span>TEST INFERENCE</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
