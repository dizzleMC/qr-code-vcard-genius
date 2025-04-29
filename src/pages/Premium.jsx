
import { useState } from "react";
import { toast } from "sonner";
import { PremiumLayout } from "@/components/premium/PremiumLayout";
import { ImportStep } from "@/components/premium/ImportStep";
import { TemplateStep } from "@/components/premium/TemplateStep";
import { GenerateStep } from "@/components/premium/GenerateStep";
import { useTemplateSettings } from "@/components/premium/hooks/useTemplateSettings";
import { useGenerateQRCodes } from "@/components/premium/hooks/useGenerateQRCodes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <PremiumLayout currentStep={currentStep}>
      <div className="space-y-8">
        {currentStep === 1 && (
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-white border-b border-gray-100 pb-4">
              <CardTitle>Daten importieren</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <ImportStep onImportSuccess={handleImportSuccess} />
            </CardContent>
          </Card>
        )}
        
        {currentStep === 2 && (
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-white border-b border-gray-100 pb-4">
              <CardTitle>QR-Code & Namensschild anpassen</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
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
            </CardContent>
          </Card>
        )}
        
        {currentStep === 3 && (
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-white border-b border-gray-100 pb-4">
              <CardTitle>QR-Codes generieren</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
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
            </CardContent>
          </Card>
        )}
      </div>
    </PremiumLayout>
  );
};

export default Premium;
