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

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
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
        <div className="mt-4 text-[#ff7e0c] font-medium">
          www.yourvcard.de
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="size" className="text-[#1A1F2C]">QR-Code Größe ({qrSize}px)</Label>
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
        
        <div className="space-y-3">
          <Label htmlFor="fgColor" className="text-[#1A1F2C]">QR-Code Farbe</Label>
          <div className="flex gap-3">
            <Input
              id="fgColor"
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-12 h-12 p-1 cursor-pointer rounded-lg"
            />
            <div className="flex-1 grid grid-cols-5 gap-2">
              {["#1A1F2C", "#ff7e0c", "#8B5CF6", "#D946EF", "#F97316"].map((color) => (
                <button
                  key={color}
                  onClick={() => setFgColor(color)}
                  className="w-full h-12 rounded-lg border border-gray-200 transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                  aria-label={`Wähle Farbe ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="bgColor" className="text-[#1A1F2C]">Hintergrundfarbe</Label>
          <div className="flex gap-3">
            <Input
              id="bgColor"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-12 p-1 cursor-pointer rounded-lg"
            />
            <div className="flex-1 grid grid-cols-5 gap-2">
              {["#ffffff", "#F2FCE2", "#FEF7CD", "#E5DEFF", "#FFDEE2"].map((color) => (
                <button
                  key={color}
                  onClick={() => setBgColor(color)}
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
        className={`w-full bg-[#ff7e0c] hover:bg-[#e67008] text-white font-medium py-2.5 ${isFormEmpty ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        QR-Code Herunterladen
      </Button>
    </div>
  );
};