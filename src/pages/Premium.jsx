
import { useState } from "react";
import { toast } from "sonner";
import { ImportStep } from "@/components/premium/ImportStep";
import { TemplateStep } from "@/components/premium/TemplateStep";
import { GenerateStep } from "@/components/premium/GenerateStep";
import { useTemplateSettings } from "@/components/premium/hooks/useTemplateSettings";
import { useGenerateQRCodes } from "@/components/premium/hooks/useGenerateQRCodes";

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
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <p className="text-[#ff7e0c] font-medium mb-2">Features</p>
          <h1 className="text-4xl font-bold text-[#1A1F2C] mb-4">QRCode Bulk Generator</h1>
          <p className="text-[#64748b] max-w-2xl mx-auto mb-12">
            Powerful, self-serve product and growth analytics to help you convert, engage,
            and retain more users. Trusted by over 4,000 startups.
          </p>

          <div className="flex justify-center mb-16">
            <div className="flex items-center max-w-3xl w-full">
              {[
                { text: "Your details", desc: "Please provide your name and email", done: currentStep > 0, active: currentStep === 1 },
                { text: "Company details", desc: "A few details about your company", done: currentStep > 1, active: currentStep === 2 },
                { text: "Invite your team", desc: "Start collaborating with your team", done: false, active: currentStep === 3 }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step.done ? "bg-[#ff7e0c]" : 
                      step.active ? "bg-[#ff7e0c] ring-4 ring-orange-100" : "bg-gray-200"
                    }`}>
                      {step.done || step.active ? (
                        <span className="text-white font-medium">{idx + 1}</span>
                      ) : (
                        <span className="text-gray-500 font-medium">{idx + 1}</span>
                      )}
                    </div>
                    <span className="font-medium">{step.text}</span>
                    <span className="text-sm text-gray-500">{step.desc}</span>
                  </div>
                  
                  {idx < 2 && (
                    <div className={`flex-1 h-0.5 ${idx < currentStep - 1 ? "bg-[#ff7e0c]" : "bg-gray-200"}`} />
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
      </div>
    </div>
  );
};

export default Premium;
