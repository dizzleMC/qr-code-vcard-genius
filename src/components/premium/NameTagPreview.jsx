
import React from "react";
import { QRCodeSVG } from "qrcode.react";

export const NameTagPreview = ({ name, company, title, settings, qrValue }) => {
  // Set default values if name or company are empty
  const displayName = name || "Max Mustermann";
  const displayCompany = company || "Beispiel GmbH";
  const displayTitle = title || "";
  
  // Get dimensions based on size setting
  const getDimensions = () => {
    switch(settings.size) {
      case "small": 
        return { width: "350px", height: "175px", qrSize: 110 };
      case "large": 
        return { width: "450px", height: "225px", qrSize: 160 };
      case "medium":
      default: 
        return { width: "400px", height: "200px", qrSize: 140 };
    }
  };
  
  const dimensions = getDimensions();
  
  // Base styles for the name tag
  const nameTagStyle = {
    backgroundColor: settings.backgroundColor,
    borderColor: settings.borderColor,
    borderWidth: "2px",
    borderStyle: "solid",
    fontFamily: settings.font,
    width: dimensions.width,
    height: dimensions.height,
    borderRadius: "8px",
    display: "flex",
    padding: "1rem",
    boxSizing: "border-box",
    overflow: "hidden",
  };
  
  // Template-specific styles and layout
  const getTemplateStyles = () => {
    switch(settings.template) {
      case "modern":
        return {
          container: {
            ...nameTagStyle,
            flexDirection: "row-reverse", // QR on left, text on right
            background: `linear-gradient(to right, ${settings.backgroundColor} 70%, ${settings.borderColor}20 100%)`,
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
          }
        };
      case "minimal":
        return {
          container: {
            ...nameTagStyle,
            flexDirection: "row",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            borderWidth: "1px",
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
  
  const nameStyle = {
    color: settings.nameColor,
    fontSize: `${settings.fontSize}px`,
    fontWeight: "600",
    margin: "0 0 0.25rem 0",
    wordBreak: "break-word",
    width: "100%"
  };
  
  const titleStyle = {
    color: settings.companyColor,
    fontSize: `${Math.max(settings.fontSize - 6, 12)}px`,
    margin: "0.25rem 0",
    wordBreak: "break-word",
    width: "100%"
  };

  const companyStyle = {
    color: settings.companyColor,
    fontSize: `${Math.max(settings.fontSize - 4, 14)}px`,
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
            backgroundColor: "#ffffff",
            padding: "0.5rem",
            borderRadius: "4px"
          }}>
            <QRCodeSVG
              value={qrValue}
              size={dimensions.qrSize}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>
      )}
    </div>
  );
};
