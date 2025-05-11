import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NameTagPreview } from "./NameTagPreview";
import { Upload, X, Layout, Check, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const NameTagCreator = ({
  data,
  nameTagSettings,
  onSettingChange,
  qrCodeSettings
}) => {
  const [dragActive, setDragActive] = useState(false);
  
  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Lato", label: "Lato" },
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Arial", label: "Arial" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Georgia", label: "Georgia" },
  ];
  
  const templateOptions = [
    { value: "classic", label: "Klassisch" },
    { value: "modern", label: "Modern" },
    { value: "business", label: "Business" },
    { value: "minimal", label: "Minimalistisch" },
  ];
  
  const sizeOptions = [
    { value: "small", label: "Klein (350 × 175px)" },
    { value: "medium", label: "Mittel (400 × 200px)" },
    { value: "large", label: "Groß (450 × 225px)" },
  ];

  const syncQRCodeStyles = () => {
    if (!qrCodeSettings) {
      toast.error("Keine QR-Code Einstellungen gefunden.");
      return;
    }
    
    onSettingChange('qrBgColor', qrCodeSettings.bgColor);
    onSettingChange('qrFgColor', qrCodeSettings.fgColor);
    toast.success("QR-Code Styling übernommen!");
  };

  const handleLogoUpload = (e) => {
    e.preventDefault();
    const file = e.target.files?.[0] || (e.dataTransfer?.files && e.dataTransfer.files[0]);
    
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert("Bitte laden Sie ein Bild im Format JPEG, PNG, SVG oder GIF hoch.");
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert("Die Datei ist zu groß. Maximale Dateigröße beträgt 2MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      onSettingChange('logo', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleLogoUpload(e);
  };

  const removeLogo = () => {
    onSettingChange('logo', null);
  };
  
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
      (data.street || data.city) && `ADR:;;${data.street || ''};${data.city || ''};${data.state || ''};${data.zip || ''};${data.country || ''}`,
      "END:VCARD"
    ].filter(Boolean).join("\n");
    
    return vcard;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="enable-nametag" 
          checked={nameTagSettings.enabled} 
          onCheckedChange={(checked) => onSettingChange('enabled', checked)}
        />
        <label 
          htmlFor="enable-nametag" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Namensschild aktivieren
        </label>
      </div>

      {nameTagSettings.enabled && (
        <>
          <div className="space-y-3">
            <Label htmlFor="template" className="text-[#1A1F2C]">Layout</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templateOptions.map((template) => (
                <Card 
                  key={template.value}
                  className={`cursor-pointer transition-all border-2 ${nameTagSettings.template === template.value ? 'border-[#ff7e0c] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => onSettingChange('template', template.value)}
                >
                  <CardContent className="p-3 flex flex-col items-center">
                    <Layout size={20} className="mb-1" />
                    <span className="text-sm">{template.label}</span>
                    {nameTagSettings.template === template.value && (
                      <div className="absolute top-2 right-2 bg-[#ff7e0c] rounded-full p-0.5">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="size" className="text-[#1A1F2C]">Größe</Label>
            <div className="grid grid-cols-3 gap-3">
              {sizeOptions.map((size) => (
                <Card 
                  key={size.value}
                  className={`cursor-pointer transition-all border-2 ${nameTagSettings.size === size.value ? 'border-[#ff7e0c] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => onSettingChange('size', size.value)}
                >
                  <CardContent className="p-3 flex items-center justify-center">
                    <span className="text-sm">{size.label}</span>
                    {nameTagSettings.size === size.value && (
                      <div className="absolute top-2 right-2 bg-[#ff7e0c] rounded-full p-0.5">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={syncQRCodeStyles}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
              type="button"
            >
              <RefreshCw size={16} />
              QR-Code Styling übernehmen
            </Button>
            <p className="text-xs text-gray-500">
              Übernimmt die im QR-Code Tab definierten Farben für das Namensschild
            </p>
          </div>

          <div className="bg-[#F9FAFB] p-6 rounded-lg">
            <h3 className="text-sm font-medium mb-4 text-gray-600">Vorschau</h3>
            <div className="flex justify-center">
              <NameTagPreview
                name={`${data.firstName || ''} ${data.lastName || ''}`}
                company={data.company}
                title={data.title}
                settings={{
                  ...nameTagSettings,
                  qrFgColor: nameTagSettings.qrFgColor || "#000000",
                  qrBgColor: nameTagSettings.qrBgColor || "#ffffff"
                }}
                qrValue={generateVCardData(data)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="font" className="text-[#1A1F2C]">Schriftart</Label>
              <Select
                value={nameTagSettings.font}
                onValueChange={(value) => onSettingChange('font', value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Schriftart wählen" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fontSize" className="text-[#1A1F2C]">Schriftgröße ({nameTagSettings.fontSize}px)</Label>
              <Input
                id="fontSize"
                type="range"
                min="16"
                max="36"
                value={nameTagSettings.fontSize}
                onChange={(e) => onSettingChange('fontSize', parseInt(e.target.value))}
                className="w-full accent-[#ff7e0c] mt-1"
              />
            </div>

            <div>
              <Label htmlFor="nameColor" className="text-[#1A1F2C]">Farbe Name</Label>
              <div className="flex gap-3 mt-1">
                <div className="flex flex-col w-12 gap-2">
                  <Input
                    id="nameColor"
                    type="color"
                    value={nameTagSettings.nameColor}
                    onChange={(e) => onSettingChange('nameColor', e.target.value)}
                    className="w-12 h-12 p-1 cursor-pointer rounded-lg"
                  />
                  <Input
                    type="text"
                    value={nameTagSettings.nameColor}
                    onChange={(e) => onSettingChange('nameColor', e.target.value)}
                    className="w-full text-xs p-1"
                  />
                </div>
                <div className="flex-1 grid grid-cols-5 gap-2">
                  {["#1A1F2C", "#ff7e0c", "#8B5CF6", "#D946EF", "#F97316"].map((color) => (
                    <button
                      key={color}
                      onClick={() => onSettingChange('nameColor', color)}
                      className="w-full h-12 rounded-lg border border-gray-200 transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
                      aria-label={`Wähle Farbe ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="companyColor" className="text-[#1A1F2C]">Farbe Titel & Firma</Label>
              <div className="flex gap-3 mt-1">
                <div className="flex flex-col w-12 gap-2">
                  <Input
                    id="companyColor"
                    type="color"
                    value={nameTagSettings.companyColor}
                    onChange={(e) => onSettingChange('companyColor', e.target.value)}
                    className="w-12 h-12 p-1 cursor-pointer rounded-lg"
                  />
                  <Input
                    type="text"
                    value={nameTagSettings.companyColor}
                    onChange={(e) => onSettingChange('companyColor', e.target.value)}
                    className="w-full text-xs p-1"
                  />
                </div>
                <div className="flex-1 grid grid-cols-5 gap-2">
                  {["#8E9196", "#6E59A5", "#0EA5E9", "#64748B", "#F97316"].map((color) => (
                    <button
                      key={color}
                      onClick={() => onSettingChange('companyColor', color)}
                      className="w-full h-12 rounded-lg border border-gray-200 transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
                      aria-label={`Wähle Farbe ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="logo" className="text-[#1A1F2C]">Logo hochladen</Label>
              <div 
                className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragActive ? 'border-[#ff7e0c] bg-orange-50' : 'border-gray-300'}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('logo-upload').click()}
              >
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                    <Upload className="text-[#ff7e0c]" size={20} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Klicken oder Datei hierher ziehen</p>
                  <p className="text-xs text-gray-400">PNG, JPG, SVG, GIF (max. 2MB)</p>
                </div>
              </div>
              
              {nameTagSettings.logo && (
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="logoScale" className="text-[#1A1F2C]">Logo Größe ({nameTagSettings.logoScale}%)</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={removeLogo}
                      className="h-6 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X size={14} className="mr-1" />
                      Entfernen
                    </Button>
                  </div>
                  <Input
                    id="logoScale"
                    type="range"
                    min="10"
                    max="100"
                    value={nameTagSettings.logoScale}
                    onChange={(e) => onSettingChange('logoScale', parseInt(e.target.value))}
                    className="w-full accent-[#ff7e0c]"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="backgroundColor" className="text-[#1A1F2C]">Hintergrundfarbe</Label>
              <div className="flex gap-3 mt-1">
                <div className="flex flex-col w-12 gap-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={nameTagSettings.backgroundColor || "#ffffff"}
                    onChange={(e) => onSettingChange('backgroundColor', e.target.value)}
                    className="w-12 h-12 p-1 cursor-pointer rounded-lg"
                  />
                  <Input
                    type="text"
                    value={nameTagSettings.backgroundColor || "#ffffff"}
                    onChange={(e) => onSettingChange('backgroundColor', e.target.value)}
                    className="w-full text-xs p-1"
                  />
                </div>
                <div className="flex-1 grid grid-cols-5 gap-2">
                  {["#ffffff", "#F2FCE2", "#FEF7CD", "#E5DEFF", "#FFDEE2"].map((color) => (
                    <button
                      key={color}
                      onClick={() => onSettingChange('backgroundColor', color)}
                      className="w-full h-12 rounded-lg border border-gray-200 transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
                      aria-label={`Wähle Hintergrundfarbe ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="borderColor" className="text-[#1A1F2C]">Rahmenfarbe</Label>
              <div className="flex gap-3 mt-1">
                <div className="flex flex-col w-12 gap-2">
                  <Input
                    id="borderColor"
                    type="color"
                    value={nameTagSettings.borderColor}
                    onChange={(e) => onSettingChange('borderColor', e.target.value)}
                    className="w-12 h-12 p-1 cursor-pointer rounded-lg"
                  />
                  <Input
                    type="text"
                    value={nameTagSettings.borderColor}
                    onChange={(e) => onSettingChange('borderColor', e.target.value)}
                    className="w-full text-xs p-1"
                  />
                </div>
                <div className="flex-1 grid grid-cols-5 gap-2">
                  {["#e2e8f0", "#ff7e0c", "#D6BCFA", "#D3E4FD", "#FDE1D3"].map((color) => (
                    <button
                      key={color}
                      onClick={() => onSettingChange('borderColor', color)}
                      className="w-full h-12 rounded-lg border border-gray-200 transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
                      aria-label={`Wähle Rahmenfarbe ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
