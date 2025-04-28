
import { Button } from "@/components/ui/button";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { ContactPreview } from "@/components/ContactPreview";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const TemplateStep = ({ 
  templateData,
  templateSettings,
  importedData,
  selectedContact,
  onTemplateChange,
  onSelectContact,
  onNextStep 
}) => {
  return (
    <div className="space-y-8">
      <Card className="bg-white">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">
            Schritt 2: QR-Code Template anpassen
          </h2>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="bg-gray-50/50 rounded-lg p-8">
            <QRCodeDisplay
              data={selectedContact || templateData}
              initialSize={templateSettings.size}
              initialFgColor={templateSettings.fgColor}
              initialBgColor={templateSettings.bgColor}
              onSizeChange={(size) => onTemplateChange('size', size)}
              onFgColorChange={(color) => onTemplateChange('fgColor', color)}
              onBgColorChange={(color) => onTemplateChange('bgColor', color)}
            />
          </div>
          
          <ContactPreview
            contacts={importedData}
            selectedContact={selectedContact}
            onSelectContact={onSelectContact}
          />
          
          <div className="flex justify-end">
            <Button
              onClick={onNextStep}
              className="bg-[#ff7e0c] text-white font-medium hover:bg-[#ff7e0c]/90"
            >
              Weiter zu Schritt 3
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
