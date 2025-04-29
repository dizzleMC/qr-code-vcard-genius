
import { Button } from "@/components/ui/button";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { ContactPreview } from "@/components/ContactPreview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NameTagCreator } from "./NameTagCreator";
import { Save, ChevronLeft } from "lucide-react";

export const TemplateStep = ({ 
  templateData,
  templateSettings,
  importedData,
  selectedContact,
  onTemplateChange,
  onSelectContact,
  onNextStep,
  onApplyQRConfig,
  onPreviousStep
}) => {
  const handleNameTagSettingChange = (setting, value) => {
    onTemplateChange('nameTag', {
      ...templateSettings.nameTag,
      [setting]: value
    });
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="qrcode" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="qrcode" className="py-3">QR-Code</TabsTrigger>
          <TabsTrigger value="nametag" className="py-3">Namensschild</TabsTrigger>
        </TabsList>
        
        <TabsContent value="qrcode" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-medium">QR-Code Einstellungen</h3>
              
              <QRCodeDisplay
                data={selectedContact || templateData}
                initialSize={templateSettings.size}
                initialFgColor={templateSettings.fgColor}
                initialBgColor={templateSettings.bgColor}
                onSizeChange={(size) => onTemplateChange('size', size)}
                onFgColorChange={(color) => onTemplateChange('fgColor', color)}
                onBgColorChange={(color) => onTemplateChange('bgColor', color)}
              />
              
              <Button 
                onClick={onApplyQRConfig}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Save size={16} />
                QR-Code Konfiguration übernehmen
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Kontakt Vorschau</h3>
                <ContactPreview
                  contacts={importedData}
                  selectedContact={selectedContact}
                  onSelectContact={onSelectContact}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="nametag" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-medium">Namensschild Einstellungen</h3>
              
              <NameTagCreator
                data={selectedContact || templateData}
                nameTagSettings={templateSettings.nameTag || {
                  enabled: false,
                  template: "classic",
                  size: "medium",
                  font: "Inter",
                  fontSize: 22,
                  nameColor: "#1A1F2C",
                  companyColor: "#8E9196",
                  logo: null,
                  logoScale: 100,
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  qrFgColor: "#000000",
                  qrBgColor: "#ffffff"
                }}
                onSettingChange={handleNameTagSettingChange}
                qrCodeSettings={{
                  fgColor: templateSettings.fgColor,
                  bgColor: templateSettings.bgColor
                }}
              />
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Kontakt Vorschau</h3>
                <ContactPreview
                  contacts={importedData}
                  selectedContact={selectedContact}
                  onSelectContact={onSelectContact}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button
          onClick={onNextStep}
          className="px-8 bg-accent hover:bg-accent/90 text-white"
          size="lg"
        >
          Weiter zu Schritt 3
        </Button>
      </div>
    </div>
  );
};
