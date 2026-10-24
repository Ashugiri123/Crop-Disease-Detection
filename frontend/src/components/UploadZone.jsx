import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, ArrowRight, AlertCircle, FileCheck } from 'lucide-react';
import './UploadZone.css';

export default function UploadZone() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const sampleLeaves = [
    {
      name: "Tomato Early Blight",
      path: "/assets/tomato_early_blight_leaf.jpg",
      crop: "Tomato",
      disease: "Early Blight",
      isHealthy: false,
      confidence: 0.942,
    },
    {
      name: "Bell Pepper Bacterial Spot",
      path: "/assets/real_bell_pepper_spot.jpg",
      crop: "Bell Pepper",
      disease: "Bacterial Spot",
      isHealthy: false,
      confidence: 0.985,
    },
    {
      name: "Healthy Tomato",
      path: "/assets/tomato_leaf.jpg",
      crop: "Tomato",
      disease: "Healthy",
      isHealthy: true,
      confidence: 0.991,
    }
  ];

  const handleFiles = (file) => {
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Please upload a valid image file (JPEG, PNG, WEBP, or BMP).");
      return;
    }

    // Validate size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Image size exceeds the 10 MB limit.");
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSampleSelect = (sample) => {
    setErrorMsg(null);
    setPreviewUrl(sample.path);
    setSelectedFile({
      name: sample.name,
      size: 45000,
      isSample: true,
      sampleData: sample
    });
  };

  const handleAnalyzeClick = () => {
    if (!previewUrl) return;

    // Note: In Frontend Step 2, API is not connected yet.
    // We navigate to /result passing the image preview state and sample simulation so the user can test the flow.
    const resultState = selectedFile?.isSample
      ? {
          imageSrc: previewUrl,
          fileName: selectedFile.name,
          mockResult: {
            predicted_class: `${selectedFile.sampleData.crop} - ${selectedFile.sampleData.disease}`,
            crop: selectedFile.sampleData.crop,
            disease: selectedFile.sampleData.disease,
            is_healthy: selectedFile.sampleData.isHealthy,
            confidence: selectedFile.sampleData.confidence,
            top_predictions: [
              { class_name: `${selectedFile.sampleData.crop} - ${selectedFile.sampleData.disease}`, confidence: selectedFile.sampleData.confidence },
              { class_name: `${selectedFile.sampleData.crop} - Healthy`, confidence: 0.035 },
              { class_name: "Potato - Early Blight", confidence: 0.012 }
            ]
          }
        }
      : {
          imageSrc: previewUrl,
          fileName: selectedFile?.name || "Uploaded_Leaf.jpg",
          mockResult: {
            predicted_class: "Tomato - Late Blight",
            crop: "Tomato",
            disease: "Late Blight",
            is_healthy: false,
            confidence: 0.917,
            top_predictions: [
              { class_name: "Tomato - Late Blight", confidence: 0.917 },
              { class_name: "Tomato - Early Blight", confidence: 0.052 },
              { class_name: "Tomato - Septoria Leaf Spot", confidence: 0.018 }
            ]
          }
        };

    navigate('/result', { state: resultState });
  };

  return (
    <div className="upload-zone-wrapper">
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/jpeg,image/png,image/webp,image/bmp" 
        className="hidden-file-input" 
        id="leaf-file-input"
        onChange={handleFileInputChange}
      />

      {errorMsg && (
        <div className="upload-error-alert animate-fade-in">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {!previewUrl ? (
        <div 
          className={`drop-zone-card glass-panel ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
        >
          <div className="drop-icon-sphere">
            <UploadCloud size={38} className="upload-cloud-icon" />
          </div>

          <h3 className="drop-title">Drop your leaf image here, or <span className="browse-highlight">Browse</span></h3>
          <p className="drop-subtitle">High resolution photos of a single leaf work best</p>

          <div className="supported-formats-pills">
            <span className="format-pill">JPG</span>
            <span className="format-pill">PNG</span>
            <span className="format-pill">WEBP</span>
            <span className="format-pill">Max 10MB</span>
          </div>
        </div>
      ) : (
        <div className="preview-container glass-panel animate-fade-in">
          <div className="preview-header">
            <div className="preview-file-info">
              <FileCheck size={18} className="file-check-icon" />
              <span className="preview-filename">{selectedFile?.name || "Leaf Image"}</span>
            </div>
            <button 
              type="button" 
              className="btn-clear-image"
              onClick={clearSelection}
              aria-label="Remove image"
            >
              <X size={16} />
              <span>Remove</span>
            </button>
          </div>

          <div className="preview-image-wrapper">
            <img src={previewUrl} alt="Selected crop leaf preview" className="preview-image-element" />
          </div>

          <div className="preview-actions">
            <button 
              type="button" 
              className="btn-primary analyze-cta-btn"
              onClick={handleAnalyzeClick}
            >
              <span>Analyze Disease</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Quick Sample Selector */}
      <div className="sample-leaves-section">
        <span className="sample-label">Or test with a sample leaf:</span>
        <div className="sample-buttons-row">
          {sampleLeaves.map((sample, idx) => (
            <button 
              key={idx}
              type="button"
              className="sample-leaf-chip"
              onClick={() => handleSampleSelect(sample)}
            >
              <img src={sample.path} alt={sample.name} className="sample-chip-thumb" />
              <span>{sample.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
