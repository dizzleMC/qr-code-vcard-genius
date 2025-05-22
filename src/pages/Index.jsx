
import { useState } from "react";
import { VCardForm } from "@/components/VCardForm";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Link } from "react-router-dom";

const Index = () => {
  const [vCardData, setVCardData] = useState({
    firstName: "",
    lastName: "",
    academicTitle: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    mobile: "",
    phone_work: "",
    website: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    id: "",
  });

  console.log("Index.jsx - Current vCard data:", vCardData);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, rgba(255, 126, 12, 0.1), white)"
    }}>
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
                fontWeight: "600",
                color: "#ff7e0c",
                textDecoration: "none",
                borderBottom: "2px solid #ff7e0c",
                paddingBottom: "0.25rem"
              }}>
                Einzel QR-Code
              </Link>
            </li>
            <li>
              <Link to="/premium" style={{
                fontWeight: "500",
                color: "#8E9196",
                textDecoration: "none"
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
          }}>QR-Code Generator</h1>
          <p style={{
            color: "#8E9196",
            fontSize: "1.125rem"
          }}>
            Erstellen Sie einen QR-Code für Ihre Kontaktdaten
          </p>
        </div>
        
        <div style={{
          display: "flex",
          flexDirection: window.innerWidth < 1024 ? "column" : "row",
          gap: "4rem",
          alignItems: "flex-start",
          justifyContent: "center"
        }}>
          <div style={{
            width: "100%",
            maxWidth: window.innerWidth < 1024 ? "100%" : "50%",
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            padding: "2rem"
          }}>
            <VCardForm onDataChange={setVCardData} />
          </div>
          <div style={{
            width: "100%",
            maxWidth: window.innerWidth < 1024 ? "100%" : "50%",
            position: window.innerWidth < 1024 ? "static" : "sticky",
            top: window.innerWidth < 1024 ? "auto" : "2rem"
          }}>
            <QRCodeDisplay data={vCardData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
