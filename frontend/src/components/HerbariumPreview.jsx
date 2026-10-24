import React from 'react';
import { Link } from 'react-router-dom';
import './HerbariumPreview.css';

export default function HerbariumPreview() {
  const herbariumCards = [
    {
      cropTaxon: "SOLANUM LYCOPERSICUM",
      diseaseName: "Alternaria solani",
      commonName: "Early Blight",
      severity: "SEVERE",
      severityClass: "severity-severe",
      description: "Characterized by target-shaped brown lesions with marked chlorotic tissue margins.",
      confirmedRate: "94.2% CONFIRMED",
      specId: "SPEC-084",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtA_Iem5X4Vt2tvpNHdHn1BhOXe-5E8u6o0RgR6ylh3naDrlbByC5RNZ5tg2aS1CkfCXD_T-XSeBVDRt-1EqvswRmbO70McKltB-vLwKHJBR4N9VBfW7i7095YyQHcnMK_-wTUsttgbeyW2S4uxAiwf3Ap_5WDroTeXLZGk9nP8VkMZ63I70aGIubxMOodbwLjmGdV_71drMxNrZ0A8bco3o8VK3G11zMHmATXnRR3FBj0Otpk7mH_5A",
      fallback: "/assets/tomato_early_blight_leaf.jpg"
    },
    {
      cropTaxon: "MALUS DOMESTICA",
      diseaseName: "Botryosphaeria obtusa",
      commonName: "Black Rot",
      severity: "MODERATE",
      severityClass: "severity-moderate",
      description: "Frogeye leaf spot morphology producing small purple specks expanding to necrotic zones.",
      confirmedRate: "91.8% CONFIRMED",
      specId: "SPEC-091",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-rI4GnFGHfHn42fWSsT8etxXNaDIytaqDqRaKT8cHeV8dmVS3YefER7ofjWGXBi5cVoV5gPWVlWggUaSdh9iaUCUFPZAuFHLXA_CDxtcgzix0fDRYHBWkIEodDsgn1hEq8uby7Sl0LeRyMtgxLY3wVUeQz5oSDNFomGmfCw7NpbAn1JD8Z-sKbY8HCsX5b8pdHfoBBxhX_k0kSzrvRYz0Vm5Vb5Lc6IgqmAKf5UkmdM2yZ9o-L_iOQg",
      fallback: "/assets/tomato_early_blight_leaf.jpg"
    },
    {
      cropTaxon: "ZEA MAYS",
      diseaseName: "Puccinia sorghi",
      commonName: "Common Rust",
      severity: "SEVERE",
      severityClass: "severity-severe",
      description: "Cinnamon-brown elongated pustules appearing on both upper and lower foliar surfaces.",
      confirmedRate: "96.4% CONFIRMED",
      specId: "SPEC-112",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXuNomGmb3EbS72LW-th-thq2BzTcxxG7V0F1gyuhM9PmiE7RDuT7gzexqj6hcDLVDozNmLSApYENRjCttwSsxZY49S7hbD5sRMMcwyWDM72Xz8uT6bj6VWk9T0WSqSTPO2jC30GlyubHnxcS8STFmQhBeEMV8NYzltDSNDZAju7yiYBJh5-DFOhlypa_eOArGf5M-IT7mxgqPJqHJRmDqZ8BYg5QsWx2gUsROAbaNogw5wStPBs4rQg",
      fallback: "/assets/real_bell_pepper_spot.jpg"
    },
    {
      cropTaxon: "VITIS VINIFERA",
      diseaseName: "Healthy Foliar Specimen",
      commonName: "Healthy Control",
      severity: "NOMINAL",
      severityClass: "severity-nominal",
      description: "Asymptomatic tissue baseline utilized for negative control differential normalization.",
      confirmedRate: "CONTROL 0.0% PATH",
      specId: "SPEC-001",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYNTwhARRj1L5g6scCCM3rGr1zD1q46tgTC1kMAtoM5emIvjssfzBvM8eXgjijnXviexJzBIGp14-CWpxGso3DlwxQdKdbP5qZFWm484akgOk6jeHLtcewUix9EWQOF2FRHifTZdyRrWnNpicG5hAA-4oeRZNiGTt92ELCpQY23bNYC_YwWIqoCXFFxzoZvMbfGvlNy6JPTPHsWquEhNotNmCnE5UJ1URPJjZhjkM-Gy0P62RXtyzVhg",
      fallback: "/assets/tomato_leaf.jpg"
    }
  ];

  return (
    <section className="stitch-compendium-section" id="compendium">
      <div className="compendium-header-row">
        <div>
          <div className="compendium-eyebrow">INDEXED REFERENCE HERBARIUM</div>
          <h2 className="compendium-title">MONITORED PHYTOLOGICAL SPECIMENS.</h2>
        </div>
        <Link to="/diseases" className="compendium-all-link">
          <span>VIEW FULL 29-CLASS TAXONOMY</span>
          <span className="material-symbols-outlined text-[16px]">north_east</span>
        </Link>
      </div>

      <div className="compendium-grid">
        {herbariumCards.map((card, idx) => (
          <div key={idx} className="herbarium-card">
            <div className="herbarium-img-wrap">
              <img 
                src={card.image} 
                alt={card.diseaseName} 
                className="herbarium-img" 
                onError={(e) => { e.currentTarget.src = card.fallback; }}
              />
              <div className={`herbarium-severity-badge ${card.severityClass}`}>
                {card.severity}
              </div>
            </div>

            <div className="herbarium-body">
              <div>
                <span className="herbarium-taxon">{card.cropTaxon}</span>
                <h3 className="herbarium-disease-name">{card.diseaseName}</h3>
                <p className="herbarium-desc">{card.description}</p>
              </div>

              <div className="herbarium-footer">
                <span className="herbarium-rate">{card.confirmedRate}</span>
                <span className="herbarium-spec-id">{card.specId}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
