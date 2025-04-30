
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
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <p className="text-accent font-medium mb-2">Premium Features</p>
        <h1 className="text-4xl font-bold text-[#1A1F2C] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#1A1F2C] to-[#4A5568]">
          QRCode Bulk Generator
        </h1>
        <p className="text-[#64748b] max-w-2xl mx-auto">
          Erstellen Sie professionelle QR-Codes und Namensschilder für all Ihre Kontakte mit einem Klick.
        </p>

        <div className="flex justify-center mb-16 mt-12">
          <div className="flex items-center max-w-3xl w-full">
            {[
              { text: "Excel Import", desc: "Importieren Sie Ihre Kontakte", done: currentStep > 0, active: currentStep === 1 },
              { text: "Anpassung", desc: "Gestalten Sie Ihre QR-Codes", done: currentStep > 1, active: currentStep === 2 },
              { text: "Generierung", desc: "Laden Sie Ihre Dateien herunter", done: false, active: currentStep === 3 }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-1 items-center">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    step.done ? "bg-gradient-to-r from-[#ff7e0c] to-[#ff9a41]" : 
                    step.active ? "bg-gradient-to-r from-[#ff7e0c] to-[#ff9a41] ring-4 ring-orange-100" : "bg-gray-200"
                  }`}>
                    {step.done || step.active ? (
                      <span className="text-white font-medium text-lg">{idx + 1}</span>
                    ) : (
                      <span className="text-gray-500 font-medium text-lg">{idx + 1}</span>
                    )}
                  </div>
                  <span className="font-medium">{step.text}</span>
                  <span className="text-sm text-gray-500">{step.desc}</span>
                </div>
                
                {idx < 2 && (
                  <div className={`flex-1 h-1 rounded-full ${idx < currentStep - 1 ? "bg-gradient-to-r from-[#ff7e0c] to-[#ff9a41]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
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
    </PremiumLayout>
  );
};

export default Premium;
