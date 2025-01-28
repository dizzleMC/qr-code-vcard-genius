import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { VCardData } from "./VCardForm";
import { toast } from "sonner";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface QRCodeDisplayProps {
  data: VCardData;
}

export const QRCodeDisplay = ({ data }: QRCodeDisplayProps) => {
  const [qrSize, setQrSize] = useState(200);

  const generateVCardData = (data: VCardData): string => {
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
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${data.firstName}-${data.lastName}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success("QR-Code wurde heruntergeladen!");
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    if (newSize >= 100 && newSize <= 400) {
      setQrSize(newSize);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div id="qr-code" className="p-4 bg-white rounded-lg shadow-lg">
        <QRCodeSVG
          value={generateVCardData(data)}
          size={qrSize}
          level="H"
          includeMargin={true}
        />
      </div>
      <div className="w-full max-w-xs space-y-2">
        <Label htmlFor="size">QR-Code Größe ({qrSize}px)</Label>
        <Input
          id="size"
          type="range"
          min="100"
          max="400"
          value={qrSize}
          onChange={handleSizeChange}
          className="w-full"
        />
      </div>
      <Button 
        onClick={handleDownload}
        className="bg-accent hover:bg-accent/90 text-white"
      >
        QR-Code Herunterladen
      </Button>
    </div>
  );
};