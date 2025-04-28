import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { getDimensions } from "@/utils/nameTagGenerator";

export const NameTagPreview = ({ name, company, title, settings, qrValue }) => {
  // Set default values if name or company are empty
  const displayName = name || "Max Mustermann";
  const displayCompany = company || "Beispiel GmbH";
  const displayTitle = title || "";
  
  // Get dimensions based on size setting using the same function as the generator
  const dimensions = getDimensions(settings.size || "medium");
  console.log("NameTagPreview dimensions:", dimensions);
  
  // Base styles for the name tag with adjusted font size based on dimensions
  const nameTagStyle = {
    backgroundColor: settings.backgroundColor || "#ffffff",
    borderColor: settings.borderColor || "#e2e8f0",
    borderWidth: "2px",
    borderStyle: "solid",
    fontFamily: settings.font || "Inter",
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    borderRadius: "8px",
    display: "flex",
    padding: "1rem",
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative", // Added position relative to all templates
  };
  
  // Template-specific styles and layout
  const getTemplateStyles = () => {
    switch(settings.template) {
      case "modern":
        return {
          container: {
            ...nameTagStyle,
            flexDirection: "row-reverse", // QR on left, text on right
            background: `linear-gradient(to right, ${settings.backgroundColor || "#ffffff"} 70%, ${settings.borderColor || "#e2e8f0"}20 100%)`,
          },
          contentWrapper: {
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            textAlign: "right",
            paddingRight: "1rem",
          },
          qrWrapper: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 0.5rem",
          }
        };
      case "business":
        return {
          container: {
            ...nameTagStyle,
            flexDirection: "column",
            background: `linear-gradient(to bottom, ${settings.backgroundColor || "#ffffff"} 85%, ${settings.borderColor || "#e2e8f0"}20 100%)`,
            position: "relative", // Ensure relative positioning for business layout
          },
          contentWrapper: {
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          },
          qrWrapper: {
            position: "absolute",
            bottom: "10px",
            right: "10px",
            zIndex: 2, // Ensure QR code is above other elements
          }
        };
      case "minimal":
        return {
          container: {
            ...nameTagStyle,
            flexDirection: "row",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            borderWidth: "1px",
            background: `linear-gradient(to right, ${settings.backgroundColor || "#ffffff"} 90%, ${settings.borderColor || "#e2e8f0"}10 100%)`,
          },
          contentWrapper: {
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          },
          qrWrapper: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }
        };
      case "classic":
      default:
        return {
          container: {
            ...nameTagStyle,
            flexDirection: "row",
            background: `linear-gradient(to right, ${settings.backgroundColor || "#ffffff"} 85%, ${settings.borderColor || "#e2e8f0"}15 100%)`,
          },
          contentWrapper: {
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          },
          qrWrapper: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }
        };
    }
  };
  
  const templateStyles = getTemplateStyles();
  
  // Calculate font sizes dynamically based on tag size
  const nameFontSize = Math.max(dimensions.fontSize, 18);
  const titleFontSize = Math.max(dimensions.fontSize - 6, 12);
  const companyFontSize = Math.max(dimensions.fontSize - 4, 14);
  
  const nameStyle = {
    color: settings.nameColor || "#1A1F2C",
    fontSize: `${nameFontSize}px`,
    fontWeight: "600",
    margin: "0 0 0.25rem 0",
    wordBreak: "break-word",
    width: "100%"
  };
  
  const titleStyle = {
    color: settings.companyColor || "#8E9196",
    fontSize: `${titleFontSize}px`,
    margin: "0.25rem 0",
    wordBreak: "break-word",
    width: "100%"
  };

  const companyStyle = {
    color: settings.companyColor || "#8E9196",
    fontSize: `${companyFontSize}px`,
    margin: "0.25rem 0 0 0",
    wordBreak: "break-word",
    width: "100%"
  };

  return (
    <div style={templateStyles.container} className="shadow-sm">
      <div style={templateStyles.contentWrapper}>
        {settings.logo && settings.template !== "business" && (
          <div style={{ maxWidth: `${settings.logoScale}%`, maxHeight: "60px", marginBottom: "12px" }}>
            <img 
              src={settings.logo} 
              alt="Logo" 
              style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} 
            />
          </div>
        )}
        
        {settings.template === "business" && settings.logo && (
          <div style={{ maxWidth: `${settings.logoScale}%`, maxHeight: "60px", marginBottom: "12px", alignSelf: "center" }}>
            <img 
              src={settings.logo} 
              alt="Logo" 
              style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} 
            />
          </div>
        )}
        
        <p style={nameStyle}>{displayName}</p>
        
        {displayTitle && <p style={titleStyle}>{displayTitle}</p>}
        
        {displayCompany && <p style={companyStyle}>{displayCompany}</p>}
      </div>
      
      {qrValue && (
        <div style={templateStyles.qrWrapper}>
          <div style={{
            backgroundColor: settings.qrBgColor || "#ffffff",
            padding: "0.5rem",
            borderRadius: "4px"
          }}>
            <QRCodeSVG
              value={qrValue}
              size={dimensions.qrSize}
              level="M"
              bgColor={settings.qrBgColor || "#ffffff"}
              fgColor={settings.qrFgColor || "#000000"}
            />
          </div>
        </div>
      )}
    </div>
  );
};
