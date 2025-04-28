
import { Button } from "@/components/ui/button";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { ContactPreview } from "@/components/ContactPreview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NameTagCreator } from "./NameTagCreator";
import { Save } from "lucide-react";

export const TemplateStep = ({ 
  templateData,
  templateSettings,
  importedData,
  selectedContact,
  onTemplateChange,
  onSelectContact,
  onNextStep,
  onApplyQRConfig
}) => {
  const handleNameTagSettingChange = (setting, value) => {
    onTemplateChange('nameTag', {
      ...templateSettings.nameTag,
      [setting]: value
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6">
          Schritt 2: QR-Code & Namensschild anpassen
        </h2>
        
        {/* Always render the tabs regardless of other conditions */}
        <Tabs defaultValue="qrcode" className="mb-6">
          <TabsList className="w-full">
            <TabsTrigger value="qrcode" className="w-1/2">QR-Code</TabsTrigger>
            <TabsTrigger value="nametag" className="w-1/2">Namensschild</TabsTrigger>
          </TabsList>
          
          <TabsContent value="qrcode">
            <div className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="nametag">
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
          </TabsContent>
        </Tabs>
        
        <ContactPreview
          contacts={importedData}
          selectedContact={selectedContact}
          onSelectContact={onSelectContact}
        />
        
        <Button
          onClick={onNextStep}
          className="mt-6 w-full bg-[#ff7e0c] text-white font-medium"
        >
          Weiter zu Schritt 3
        </Button>
      </div>
    </div>
  );
};
