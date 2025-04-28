
import React from "react";

export const NameTagPreview = ({ name, company, title, settings }) => {
  // Set default values if name or company are empty
  const displayName = name || "Max Mustermann";
  const displayCompany = company || "Beispiel GmbH";
  const displayTitle = title || "";
  
  const nameTagStyle = {
    backgroundColor: settings.backgroundColor,
    borderColor: settings.borderColor,
    borderWidth: "2px",
    borderStyle: "solid",
    fontFamily: settings.font,
    width: "100%",
    height: "200px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    boxSizing: "border-box",
    overflow: "hidden",
  };

  const nameStyle = {
    color: settings.nameColor,
    fontSize: `${settings.fontSize}px`,
    fontWeight: "600",
    margin: "0",
    textAlign: "center",
    wordBreak: "break-word",
    width: "100%"
  };
  
  const titleStyle = {
    color: settings.companyColor,
    fontSize: `${Math.max(settings.fontSize - 6, 12)}px`,
    margin: "4px 0",
    textAlign: "center",
    wordBreak: "break-word",
    width: "100%"
  };

  const companyStyle = {
    color: settings.companyColor,
    fontSize: `${Math.max(settings.fontSize - 4, 14)}px`,
    margin: "0",
    textAlign: "center",
    wordBreak: "break-word",
    width: "100%"
  };

  return (
    <div style={nameTagStyle} className="shadow-sm">
      {settings.logo && (
        <div className="mb-4" style={{ maxWidth: `${settings.logoScale}%`, maxHeight: "60px", marginBottom: "12px" }}>
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
  );
};
