import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const QRCodeDisplay = ({ data }) => {
  const [qrSize, setQrSize] = useState(200);
  const [fgColor, setFgColor] = useState("#1A1F2C");
  const [bgColor, setBgColor] = useState("#ffffff");

  const isFormEmpty = Object.values(data).every(value => value === "");

  const generateVCardData = (data) => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${data.lastName};${data.firstName};;;`,
      `FN:${data.firstName} ${data.lastName}`,
      data.title && `TITLE:${data.title}`,
      data.company && `ORG:${data.company}`,
      data.email && `EMAIL:${data.email}`,
      data.phone && `TEL:${data.phone}`,
      data.website && `URL:${data.website}`,
      data.street && data.city && `ADR:;;${data.street};${data.city};${data.state};${data.zip};${data.country}`,
      "END:VCARD"
    ].filter(Boolean).join("\n");
    
    return vcard;
  };

  const handleDownload = () => {
    const svg = document.querySelector("#qr-code svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height + 40;
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(img, 0, 0);
      
      ctx.font = "16px Arial";
      ctx.fillStyle = "#ff7e0c";
      ctx.textAlign = "center";
      ctx.fillText("www.yourvcard.de", canvas.width / 2, img.height + 25);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${data.firstName}-${data.lastName}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success("QR-Code wurde heruntergeladen!");
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    if (newSize >= 100 && newSize <= 400) {
      setQrSize(newSize);
    }
  };

  const containerStyle = {
    backgroundColor: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem"
  };

  const qrContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  };

  const qrWrapperStyle = {
    padding: "1.5rem",
    backgroundColor: "#F9FAFB",
    borderRadius: "0.5rem"
  };

  const urlStyle = {
    marginTop: "1rem",
    color: "#ff7e0c",
    fontWeight: "500"
  };

  const controlsContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.75rem",
    color: "#1A1F2C"
  };

  const colorPickerContainerStyle = {
    display: "flex",
    gap: "0.75rem"
  };

  const colorGridStyle = {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "0.5rem"
  };

  const colorButtonStyle = {
    width: "100%",
    height: "3rem",
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
    transition: "transform 0.2s",
    cursor: "pointer"
  };

  return (
    <div style={containerStyle}>
      <div id="qr-code" style={qrContainerStyle}>
        <div style={qrWrapperStyle}>
          <QRCodeSVG
            value={generateVCardData(data)}
            size={qrSize}
            level="H"
            includeMargin={true}
            fgColor={fgColor}
            bgColor={bgColor}
          />
        </div>
        <div style={urlStyle}>
          www.yourvcard.de
        </div>
      </div>
      
      <div style={controlsContainerStyle}>
        <div>
          <Label htmlFor="size" style={labelStyle}>QR-Code Größe ({qrSize}px)</Label>
          <Input
            id="size"
            type="range"
            min="100"
            max="400"
            value={qrSize}
            onChange={handleSizeChange}
            style={{ width: "100%" }}
          />
        </div>
        
        <div>
          <Label htmlFor="fgColor" style={labelStyle}>QR-Code Farbe</Label>
          <div style={colorPickerContainerStyle}>
            <Input
              id="fgColor"
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              style={{
                width: "3rem",
                height: "3rem",
                padding: "0.25rem",
                cursor: "pointer",
                borderRadius: "0.5rem"
              }}
            />
            <div style={colorGridStyle}>
              {["#1A1F2C", "#ff7e0c", "#8B5CF6", "#D946EF", "#F97316"].map((color) => (
                <button
                  key={color}
                  onClick={() => setFgColor(color)}
                  style={{
                    ...colorButtonStyle,
                    backgroundColor: color
                  }}
                  aria-label={`Wähle Farbe ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="bgColor" style={labelStyle}>Hintergrundfarbe</Label>
          <div style={colorPickerContainerStyle}>
            <Input
              id="bgColor"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{
                width: "3rem",
                height: "3rem",
                padding: "0.25rem",
                cursor: "pointer",
                borderRadius: "0.5rem"
              }}
            />
            <div style={colorGridStyle}>
              {["#ffffff", "#F2FCE2", "#FEF7CD", "#E5DEFF", "#FFDEE2"].map((color) => (
                <button
                  key={color}
                  onClick={() => setBgColor(color)}
                  style={{
                    ...colorButtonStyle,
                    backgroundColor: color
                  }}
                  aria-label={`Wähle Hintergrundfarbe ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleDownload}
        disabled={isFormEmpty}
        style={{
          width: "100%",
          backgroundColor: "#ff7e0c",
          color: "white",
          fontWeight: "500",
          padding: "0.625rem",
          opacity: isFormEmpty ? "0.5" : "1",
          cursor: isFormEmpty ? "not-allowed" : "pointer"
        }}
      >
        QR-Code Herunterladen
      </Button>
    </div>
  );
};