
import { useState } from "react";
import { toast } from "sonner";
import { PremiumLayout } from "@/components/premium/PremiumLayout";
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
    <PremiumLayout>
      <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "2rem"
    }}>
        <div style={{
        display: "flex",
        justifyContent: "space-between",
        maxWidth: "600px",
        margin: "0 auto 2rem auto"
      }}>
          {[1, 2, 3].map(step => <div key={step} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
              <div style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
            backgroundColor: currentStep >= step ? "#ff7e0c" : "#e2e8f0",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            marginBottom: "0.5rem"
          }}>
                {step}
              </div>
              <span style={{
            color: currentStep >= step ? "#1A1F2C" : "#8E9196"
          }} className="my-[8px] mx-[16px] py-[16px]">
                {step === 1 && "Daten importieren"}
                {step === 2 && "Template anpassen"}
                {step === 3 && "QR-Codes generieren"}
              </span>
            </div>)}
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
