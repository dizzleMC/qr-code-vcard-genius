
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
    <div className="space-y-12">
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-white pb-6">
          <h2 className="text-xl font-medium text-gray-900">
            Schritt 2: QR-Code Template anpassen
          </h2>
        </CardHeader>
        <CardContent className="p-8 space-y-12 bg-[#FCFCFD]">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">QR-Code Vorschau</h3>
              <div className="bg-white rounded-xl shadow-sm p-8">
                <QRCodeDisplay
                  data={selectedContact || templateData}
                  initialSize={templateSettings.size}
                  initialFgColor={templateSettings.fgColor}
                  initialBgColor={templateSettings.bgColor}
                  onSizeChange={(size) => onTemplateChange('size', size)}
                  onFgColorChange={(color) => onTemplateChange('fgColor', color)}
                  onBgColorChange={(color) => onTemplateChange('bgColor', color)}
                  previewMode={true}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Kontakte</h3>
              <ContactPreview
                contacts={importedData}
                selectedContact={selectedContact}
                onSelectContact={onSelectContact}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={onNextStep}
              className="bg-[#ff7e0c] text-white font-medium hover:bg-[#ff7e0c]/90 px-8"
            >
              Weiter zu Schritt 3
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
