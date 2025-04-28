
import { QRCodeDisplay } from "@/components/QRCodeDisplay";

export const TemplateStep = ({ 
  templateData,
  templateSettings,
  importedData,
  selectedContact,
  onTemplateChange,
  onSelectContact
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">QR-Code Vorschau</h3>
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
    </div>
  );
};
