
import { useState } from "react";
import { toast } from "sonner";
import { ImportStep } from "@/components/premium/ImportStep";
import { TemplateStep } from "@/components/premium/TemplateStep";
import { GenerateStep } from "@/components/premium/GenerateStep";
import { useTemplateSettings } from "@/components/premium/hooks/useTemplateSettings";
import { useGenerateQRCodes } from "@/components/premium/hooks/useGenerateQRCodes";
import { PremiumLayout } from "@/components/premium/PremiumLayout";

const Premium = () => {
  // Template and QR code settings
  const initialTemplateSettings = {
    size: 200,
    fgColor: "#1A1F2C",
    bgColor: "#ffffff",
    nameTag: {
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
    }
  };
  
  const [templateSettings, handleTemplateChange] = useTemplateSettings(initialTemplateSettings);
  const { isGenerating, generationProgress, handleGenerateSelected, handleBulkGenerate } = useGenerateQRCodes();
  
  // Main state
  const [importedData, setImportedData] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);
  
  // Example data for template preview
  const [templateData] = useState({
    firstName: "Max",
    lastName: "Mustermann",
    title: "CEO",
    company: "Example GmbH",
    email: "example@mail.com",
    phone: "+49123456789",
    website: "www.example.com",
    street: "Musterstraße 123",
    city: "Musterstadt",
    state: "Bayern",
    zip: "80000",
    country: "Deutschland"
  });
  
  // Event handlers
  const handleApplyQRConfig = () => {
    toast.success("QR-Code Konfiguration übernommen!");
  };
  
  const handleImportSuccess = data => {
    setImportedData(data);
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBulkGenerateQR = () => {
    handleBulkGenerate(importedData, templateSettings);
  };
  
  const handleGenerateSelectedQR = (selectedContacts) => {
    handleGenerateSelected(selectedContacts, templateSettings);
  };

  const resetProcess = () => {
    setImportedData([]);
    setCurrentStep(1);
    toast.info("Prozess zurückgesetzt. Sie können neue Kontakte importieren.");
  };

  return (
    <PremiumLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-[#ff7e0c] text-sm font-medium mb-2">Features</p>
          <h1 className="text-3xl font-bold text-[#1A1F2C] mb-4">
            QRCode Bluk generator
          </h1>
          <p className="text-[#64748b] mb-8">
            vCards als QR-Codes generieren – schnell, unkompliziert & individuell
          </p>
          
          <div className="mb-12 max-w-2xl mx-auto">
            <p className="text-[#4B5563] text-left text-sm leading-relaxed mb-12">
              Mit unserer Software können Sie mehrere digitale Visitenkarten (vCards) in nur wenigen Minuten erstellen – ganz ohne manuellen Aufwand. Einfach eine Excel-Datei hochladen, und wir generieren automatisch QR-Codes für jede einzelne Kontaktperson. Ideal für Unternehmen, Messen, Events oder Teams mit vielen Mitarbeitenden.
            </p>
            
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2"></div>
              
              {/* Progress steps */}
              <div className="flex justify-between relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    currentStep === 1 ? 'bg-[#ff7e0c] text-white' : 
                    currentStep > 1 ? 'bg-[#ff7e0c] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <span className="text-sm font-medium text-center">Daten hochladen</span>
                  <span className="text-xs text-[#ff7e0c] text-center whitespace-nowrap">Datei mit den gewünschten Daten hochladen</span>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    currentStep === 2 ? 'bg-[#ff7e0c] text-white' : 
                    currentStep > 2 ? 'bg-[#ff7e0c] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <span className="text-sm font-medium text-center">Stil einstellen</span>
                  <span className="text-xs text-gray-500 text-center whitespace-nowrap">Passe das Aussehen deines QR-Codes an.</span>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    currentStep === 3 ? 'bg-[#ff7e0c] text-white' : 
                    currentStep > 3 ? 'bg-[#ff7e0c] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <span className="text-sm font-medium text-center">Dateien herunterladen</span>
                  <span className="text-xs text-gray-500 text-center whitespace-nowrap">Dateien einzeln oder gesammelt herunterladen</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentStep === 1 && <ImportStep onImportSuccess={handleImportSuccess} />}
        
        {currentStep === 2 && 
          <TemplateStep 
            templateData={templateData} 
            templateSettings={templateSettings} 
            importedData={importedData} 
            selectedContact={selectedContact} 
            onTemplateChange={handleTemplateChange} 
            onSelectContact={setSelectedContact} 
            onNextStep={() => setCurrentStep(3)}
            onApplyQRConfig={handleApplyQRConfig}
            onPreviousStep={handlePreviousStep}
          />
        }
        
        {currentStep === 3 && 
          <GenerateStep 
            importedData={importedData} 
            templateSettings={templateSettings} 
            isGenerating={isGenerating} 
            generationProgress={generationProgress} 
            onGenerate={handleBulkGenerateQR} 
            onGenerateSelected={handleGenerateSelectedQR} 
            onReset={resetProcess}
            onPreviousStep={handlePreviousStep}
          />
        }
      </div>
    </PremiumLayout>
  );
};

export default Premium;
