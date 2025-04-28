
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
  onSelectContact
}) => {
  return (
    <Card className="border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white h-full">
      <CardHeader className="border-b bg-white pb-6">
        <h2 className="text-xl font-medium text-gray-900">
          QR-Code Template
        </h2>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Vorschau</h3>
          <div className="bg-gray-50 rounded-xl p-6">
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
      </CardContent>
    </Card>
  );
};
