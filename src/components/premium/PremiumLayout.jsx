
import { Link } from "react-router-dom";
import { GuideSection } from "@/components/GuideSection";

export const PremiumLayout = ({ children }) => {
  return (
    <div 
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, rgba(255, 126, 12, 0.1), white)"
      }}
    >
      <div style={{
        padding: "3rem 1rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <nav style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem"
        }}>
          <ul style={{
            display: "flex",
            gap: "2rem",
            listStyle: "none",
            padding: 0
          }}>
            <li>
              <Link to="/" style={{
                fontWeight: "500",
                color: "#8E9196",
                textDecoration: "none"
              }}>
                Einzel QR-Code
              </Link>
            </li>
            <li>
              <Link to="/premium" style={{
                fontWeight: "600",
                color: "#ff7e0c",
                textDecoration: "none",
                borderBottom: "2px solid #ff7e0c",
                paddingBottom: "0.25rem"
              }}>
                Premium Bulk-Generator
              </Link>
            </li>
          </ul>
        </nav>
        
        <div style={{
          maxWidth: "768px",
          margin: "0 auto",
          textAlign: "center",
          marginBottom: "3rem"
        }}>
          <h1 style={{
            fontSize: "2.25rem",
            fontWeight: "600",
            color: "#1A1F2C",
            marginBottom: "0.75rem"
          }}>QR-Code Bulk Generator</h1>
          <p style={{
            color: "#8E9196",
            fontSize: "1.125rem"
          }}>
            Erstellen Sie QR-Codes für mehrere Kontakte auf einmal
          </p>
        </div>
        
        {children}
        
        <GuideSection />
      </div>
    </div>
  );
};
