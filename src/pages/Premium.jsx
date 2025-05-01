
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
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-semibold tracking-wide uppercase mb-2">Premium Features</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1F2C] mb-4">
            QR-Code Bulk Generator
          </h1>
          <p className="text-[#64748b] max-w-2xl mx-auto">
            vCards als QR-Codes generieren – schnell, unkompliziert & individuell
          </p>
          
          <div className="mt-12 mb-16">
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2"></div>
              <div className="flex justify-between relative z-10">
                {[
                  { text: "Excel Import", desc: "Importieren Sie Ihre Kontakte", active: currentStep === 1, done: currentStep > 1 },
                  { text: "Anpassung", desc: "Gestalten Sie Ihre QR-Codes", active: currentStep === 2, done: currentStep > 2 },
                  { text: "Generierung", desc: "Laden Sie Ihre Dateien herunter", active: currentStep === 3, done: false }
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2 transition-all border ${
                      step.done ? "border-none bg-accent text-white" : 
                      step.active ? "border-accent text-accent" : "border-gray-200 text-gray-400"
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`font-medium text-sm ${step.active ? "text-[#1A1F2C]" : "text-gray-500"}`}>{step.text}</span>
                    <span className="text-xs text-gray-400">{step.desc}</span>
                  </div>
                ))}
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
