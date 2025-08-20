
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const QRCodeDisplay = ({ 
  data, 
  initialSize, 
  initialFgColor, 
  initialBgColor,
  initialLogo,
  initialLogoSize,
  initialLogoOpacity,
  previewMode = false,
  onSizeChange,
  onFgColorChange,
  onBgColorChange,
  onLogoChange,
  onLogoSizeChange,
  onLogoOpacityChange
}) => {
  const [qrSize, setQrSize] = useState(initialSize || 200);
  const [fgColor, setFgColor] = useState(initialFgColor || "#1A1F2C");
  const [bgColor, setBgColor] = useState(initialBgColor || "#ffffff");
  const [logo, setLogo] = useState(initialLogo || null);
  const [logoSize, setLogoSize] = useState(initialLogoSize || 20);
  const [logoOpacity, setLogoOpacity] = useState(initialLogoOpacity || 1);

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
    if (initialLogo !== undefined) {
      setLogo(initialLogo);
      onLogoChange?.(initialLogo);
    }
    if (initialLogoSize) {
      setLogoSize(initialLogoSize);
      onLogoSizeChange?.(initialLogoSize);
    }
    if (initialLogoOpacity !== undefined) {
      setLogoOpacity(initialLogoOpacity);
      onLogoOpacityChange?.(initialLogoOpacity);
    }
  }, [initialSize, initialFgColor, initialBgColor, initialLogo, initialLogoSize, initialLogoOpacity]);

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

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo-Datei ist zu groß. Maximal 5MB erlaubt.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target.result;
        setLogo(logoUrl);
        onLogoChange?.(logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRemove = () => {
    setLogo(null);
    onLogoChange?.(null);
  };

  const handleLogoSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setLogoSize(newSize);
    onLogoSizeChange?.(newSize);
  };

  const handleLogoOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setLogoOpacity(newOpacity);
    onLogoOpacityChange?.(newOpacity);
  };

  const isFormEmpty = Object.values(data).every(value => !value || value === "");

  const generateVCardData = (data) => {
    console.log("QRCodeDisplay.jsx - vCard input data:", data);
    
    // Format the name with academic title if available
    const formattedFirstName = data.academicTitle ? 
      `${data.academicTitle} ${data.firstName || ''}` : 
      (data.firstName || '');

    // Standardized vCard format
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${data.lastName || ''};${formattedFirstName};;;`,
      `FN:${formattedFirstName} ${data.lastName || ''}`,
      `SOURCE:https://www.yourvcard.de/vcard/${data.id || ''}`,
      data.title && `TITLE:${data.title}`,
      data.title && `ROLE:${data.title}`,
      data.company && `ORG:${data.company}`,
      data.email && `EMAIL:${data.email}`,
      data.phone && `TEL;TYPE=voice:${data.phone}`,
      data.mobile && `TEL;TYPE=cell:${data.mobile}`,
      data.phone_work && `TEL;TYPE=work:${data.phone_work}`,
      data.website && `URL;TYPE=Website:${data.website}`,
      (data.street || data.city) && 
        `ADR:;;${data.street || ''};${data.city || ''};${data.state || ''};${data.zip || ''};${data.country || ''}`,
      "END:VCARD"
    ].filter(Boolean).join("\n");
    
    console.log("QRCodeDisplay.jsx - Generated vCard:", vcard);
    return vcard;
  };

  const handleDownload = async () => {
    try {
      const { toCanvas } = await import('qrcode');
      const canvas = document.createElement("canvas");
      
      await toCanvas(canvas, generateVCardData(data), {
        width: qrSize,
        margin: 4,
        color: {
          dark: fgColor,
          light: bgColor
        },
        errorCorrectionLevel: 'H'
      });

      // Add logo overlay if logo exists
      if (logo) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = logo;
        });

        if (img.complete && img.naturalWidth > 0) {
          const logoSizePx = (logoSize / 100) * canvas.width;
          const logoX = (canvas.width - logoSizePx) / 2;
          const logoY = (canvas.height - logoSizePx) / 2;
          
          // Draw white background for logo
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(logoX - 4, logoY - 4, logoSizePx + 8, logoSizePx + 8);
          
          // Draw logo with opacity
          ctx.globalAlpha = logoOpacity;
          ctx.drawImage(img, logoX, logoY, logoSizePx, logoSizePx);
          ctx.globalAlpha = 1;
        }
      }
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${data.firstName || 'qrcode'}-${data.lastName || 'contact'}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success("QR-Code wurde heruntergeladen!");
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Fehler beim Erstellen des QR-Codes.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
      <div id="qr-code" className="flex flex-col items-center">
        <div className="p-6 bg-[#F9FAFB] rounded-lg relative">
          <QRCodeSVG
            value={generateVCardData(data)}
            size={qrSize}
            level="H"
            includeMargin={true}
            fgColor={fgColor}
            bgColor={bgColor}
          />
          {logo && (
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded"
              style={{
                width: `${(logoSize / 100) * qrSize}px`,
                height: `${(logoSize / 100) * qrSize}px`,
                opacity: logoOpacity
              }}
            >
              <img 
                src={logo} 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
      
      {!previewMode && (
        <>
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
                <div className="flex flex-col w-12 gap-2">
                  <Input
                    id="fgColor"
                    type="color"
                    value={fgColor}
                    onChange={(e) => handleFgColorChange(e.target.value)}
                    className="w-12 h-12 p-1 cursor-pointer rounded-lg"
                  />
                  <Input
                    type="text"
                    value={fgColor}
                    onChange={(e) => handleFgColorChange(e.target.value)}
                    className="w-full text-xs p-1"
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
            
            <div className="space-y-3">
              <Label htmlFor="bgColor" className="text-[#1A1F2C]">Hintergrundfarbe</Label>
              <div className="flex gap-3">
                <div className="flex flex-col w-12 gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    className="w-12 h-12 p-1 cursor-pointer rounded-lg"
                  />
                  <Input
                    type="text"
                    value={bgColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    className="w-full text-xs p-1"
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
            
            <div className="space-y-3">
              <Label htmlFor="logo" className="text-[#1A1F2C]">Logo (optional)</Label>
              <div className="space-y-3">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full"
                />
                {logo && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                      <span className="text-sm text-gray-600">Logo hochgeladen</span>
                    </div>
                    <Button
                      onClick={handleLogoRemove}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Entfernen
                    </Button>
                  </div>
                )}
                {logo && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="logoSize" className="text-sm">Logo-Größe ({logoSize}%)</Label>
                      <Input
                        id="logoSize"
                        type="range"
                        min="10"
                        max="40"
                        value={logoSize}
                        onChange={handleLogoSizeChange}
                        className="w-full accent-[#ff7e0c]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logoOpacity" className="text-sm">Logo-Transparenz ({Math.round(logoOpacity * 100)}%)</Label>
                      <Input
                        id="logoOpacity"
                        type="range"
                        min="0.3"
                        max="1"
                        step="0.1"
                        value={logoOpacity}
                        onChange={handleLogoOpacityChange}
                        className="w-full accent-[#ff7e0c]"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleDownload}
            disabled={isFormEmpty}
            className={`w-full bg-[#ff7e0c] hover:bg-[#e67008] text-white font-medium py-2.5`}
          >
            QR-Code Herunterladen
          </Button>
        </>
      )}
    </div>
  );
};
