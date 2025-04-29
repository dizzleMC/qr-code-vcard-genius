
import { useState } from "react";
import { toast } from "sonner";
import { PremiumLayout } from "@/components/premium/PremiumLayout";
import { ImportStep } from "@/components/premium/ImportStep";
import { TemplateStep } from "@/components/premium/TemplateStep";
import { GenerateStep } from "@/components/premium/GenerateStep";
import { useTemplateSettings } from "@/components/premium/hooks/useTemplateSettings";
import { useGenerateQRCodes } from "@/components/premium/hooks/useGenerateQRCodes";
import { Card, CardContent } from "@/components/ui/card";

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
      <Card className="mb-8 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between max-w-4xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div 
                key={step} 
                className="flex flex-col items-center relative w-1/3"
              >
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-3
                    ${currentStep >= step ? 'bg-[#ff7e0c] text-white' : 'bg-[#f1f5f9] text-[#8E9196]'}
                    ${currentStep === step ? 'ring-4 ring-[#ff7e0c]/20' : ''}
                  `}
                >
                  {step}
                </div>
                
                {step < 3 && (
                  <div 
                    className={`absolute top-5 left-[calc(50%+20px)] right-[calc(50%-20px)] h-0.5 
                      ${currentStep > step ? 'bg-[#ff7e0c]' : 'bg-[#e2e8f0]'}`}
                  />
                )}
                
                <span 
                  className={`text-sm font-medium 
                    ${currentStep >= step ? 'text-[#1A1F2C]' : 'text-[#8E9196]'}`}
                >
                  {step === 1 && "Daten importieren"}
                  {step === 2 && "Template anpassen"}
                  {step === 3 && "QR-Codes generieren"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
