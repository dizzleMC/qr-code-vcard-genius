
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

export const QRCodeDisplay = ({ 
  data, 
  initialSize, 
  initialFgColor, 
  initialBgColor,
  previewMode = false,
  onSizeChange,
  onFgColorChange,
  onBgColorChange
}) => {
  const [qrSize, setQrSize] = useState(initialSize || 200);
  const [fgColor, setFgColor] = useState(initialFgColor || "#1A1F2C");
  const [bgColor, setBgColor] = useState(initialBgColor || "#ffffff");

  useEffect(() => {
    if (initialSize) {
      setQrSize(initialSize);
      onSizeChange?.(initialSize);
    }
    if (initialFgColor) {
      setFgColor(initialFgColor);
      onFgColorChange?.(initialFgColor);
    }
    if (initialBgColor) {
      setBgColor(initialBgColor);
      onBgColorChange?.(initialBgColor);
    }
  }, [initialSize, initialFgColor, initialBgColor]);

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    if (newSize >= 100 && newSize <= 400) {
      setQrSize(newSize);
      onSizeChange?.(newSize);
    }
  };

  const handleFgColorChange = (value) => {
    setFgColor(value);
    onFgColorChange?.(value);
  };

  const handleBgColorChange = (value) => {
    setBgColor(value);
    onBgColorChange?.(value);
  };

  const isFormEmpty = Object.values(data).every(value => !value || value === "");

  const generateVCardData = (data) => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${data.lastName || ''};${data.firstName || ''};;;`,
      `FN:${data.firstName || ''} ${data.lastName || ''}`,
      data.title && `TITLE:${data.title}`,
      data.company && `ORG:${data.company}`,
      data.email && `EMAIL:${data.email}`,
      data.phone && `TEL:${data.phone}`,
      data.website && `URL:${data.website}`,
      (data.street || data.city) && 
        `ADR:;;${data.street || ''};${data.city || ''};${data.state || ''};${data.zip || ''};${data.country || ''}`,
      "END:VCARD"
    ].filter(Boolean).join("\n");
    
    return vcard;
  };

  const handleDownload = () => {
    const svg = document.querySelector("#qr-code svg");
    if (!svg) {
      toast.error("QR-Code konnte nicht generiert werden.");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error("Browser unterstützt keine Canvas-Funktionalität.");
      return;
    }
    
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw background color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${data.firstName || 'qrcode'}-${data.lastName || 'contact'}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success("QR-Code wurde heruntergeladen!");
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
      <div id="qr-code" className="flex flex-col items-center">
        <div className="p-6 bg-[#F9FAFB] rounded-lg">
          <QRCodeSVG
            value={generateVCardData(data)}
            size={qrSize}
            level="H"
            includeMargin={true}
            fgColor={fgColor}
            bgColor={bgColor}
          />
        </div>
      </div>
      
      {!previewMode && (
        <>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="size" className="text-sm font-medium text-[#1A1F2C]">QR-Code Größe</Label>
                <span className="text-sm text-[#8E9196]">{qrSize}px</span>
              </div>
              <Input
                id="size"
                type="range"
                min="100"
                max="400"
                value={qrSize}
                onChange={handleSizeChange}
                className="w-full accent-[#ff7e0c]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fgColor" className="text-sm font-medium text-[#1A1F2C]">QR-Code Farbe</Label>
              <div className="flex gap-3">
                <div className="flex flex-col w-12 gap-2">
                  <Input
                    id="fgColor"
                    type="color"
                    value={fgColor}
                    onChange={(e) => handleFgColorChange(e.target.value)}
                    className="w-12 h-12 p-1 cursor-pointer rounded-lg border-none"
                  />
                  <Input
                    type="text"
                    value={fgColor}
                    onChange={(e) => handleFgColorChange(e.target.value)}
                    className="w-full text-xs p-1 text-center"
                  />
                </div>
                <div className="flex-1 grid grid-cols-5 gap-2">
                  {["#1A1F2C", "#ff7e0c", "#8B5CF6", "#D946EF", "#F97316"].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleFgColorChange(color)}
                      className="w-full h-12 rounded-lg border border-gray-200 transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
                      aria-label={`Wähle Farbe ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bgColor" className="text-sm font-medium text-[#1A1F2C]">Hintergrundfarbe</Label>
              <div className="flex gap-3">
                <div className="flex flex-col w-12 gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    className="w-12 h-12 p-1 cursor-pointer rounded-lg border-none"
                  />
                  <Input
                    type="text"
                    value={bgColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    className="w-full text-xs p-1 text-center"
                  />
                </div>
                <div className="flex-1 grid grid-cols-5 gap-2">
                  {["#ffffff", "#F2FCE2", "#FEF7CD", "#E5DEFF", "#FFDEE2"].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleBgColorChange(color)}
                      className="w-full h-12 rounded-lg border border-gray-200 transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
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
            className="w-full bg-[#ff7e0c] hover:bg-[#e67008] text-white font-medium flex items-center justify-center gap-2"
          >
            <Download size={18} />
            QR-Code Herunterladen
          </Button>
        </>
      )}
    </div>
  );
};
