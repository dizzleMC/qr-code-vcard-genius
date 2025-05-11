
import { Button } from "@/components/ui/button";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { ContactPreview } from "@/components/ContactPreview";

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
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6">
          Schritt 2: QR-Code Template anpassen
        </h2>
        
        <QRCodeDisplay
          data={selectedContact || templateData}
          initialSize={templateSettings.size}
          initialFgColor={templateSettings.fgColor}
          initialBgColor={templateSettings.bgColor}
          onSizeChange={(size) => onTemplateChange('size', size)}
          onFgColorChange={(color) => onTemplateChange('fgColor', color)}
          onBgColorChange={(color) => onTemplateChange('bgColor', color)}
        />
        
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
