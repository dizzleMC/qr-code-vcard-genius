
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
          <p className="text-[#ff7e0c] text-base font-semibold mb-3">Features</p>
          <h1 className="text-4xl font-semibold text-[#1A1F2C] mb-3">
            QRCode Bluk generator
          </h1>
          <p className="text-xl mb-8">
            vCards als QR-Codes generieren – schnell, unkompliziert & individuell
          </p>
          
          <div className="mb-12 max-w-3xl mx-auto">
            <p className="text-slate-600 text-xl leading-loose mb-12">
              Mit unserer Software können Sie mehrere digitale Visitenkarten (vCards) in nur wenigen Minuten erstellen – ganz ohne manuellen Aufwand. Einfach eine Excel-Datei hochladen, und wir generieren automatisch QR-Codes für jede einzelne Kontaktperson. Ideal für Unternehmen, Messen, Events oder Teams mit vielen Mitarbeitenden.
            </p>
            
            <div className="relative mt-16">
              {/* Progress line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
              
              {/* Progress steps */}
              <div className="flex justify-between relative z-10">
                {/* Step 1 */}
                <div className="w-80 flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-xl flex items-center justify-center mb-3 ${
                    currentStep === 1 ? 'bg-[#ff7e0c] shadow-[0px_0px_0px_4px_rgba(255,126,12,0.24)]' : 
                    currentStep > 1 ? 'bg-[#ff7e0c]' : 'bg-white border border-gray-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-white' : 'bg-gray-300'}`}></span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-semibold ${currentStep === 1 ? 'text-[#e67008]' : 'text-slate-700'}`}>
                      Daten hochladen
                    </span>
                    <span className={`text-sm ${currentStep === 1 ? 'text-[#ff7e0c]' : 'text-slate-600'}`}>
                      Datei mit den gewünschten Daten hochladen
                    </span>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="w-80 flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-xl flex items-center justify-center mb-3 ${
                    currentStep === 2 ? 'bg-[#ff7e0c] shadow-[0px_0px_0px_4px_rgba(255,126,12,0.24)]' : 
                    currentStep > 2 ? 'bg-[#ff7e0c]' : 'bg-white border border-gray-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-white' : 'bg-gray-300'}`}></span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-semibold ${currentStep === 2 ? 'text-[#e67008]' : 'text-slate-700'}`}>
                      Stil einstellen
                    </span>
                    <span className={`text-sm ${currentStep === 2 ? 'text-[#ff7e0c]' : 'text-slate-600'}`}>
                      Passe das Aussehen deines QR-Codes an.
                    </span>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="w-80 flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-xl flex items-center justify-center mb-3 ${
                    currentStep === 3 ? 'bg-[#ff7e0c] shadow-[0px_0px_0px_4px_rgba(255,126,12,0.24)]' : 
                    currentStep > 3 ? 'bg-[#ff7e0c]' : 'bg-white border border-gray-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-white' : 'bg-gray-300'}`}></span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-semibold ${currentStep === 3 ? 'text-[#e67008]' : 'text-slate-700'}`}>
                      Dateien herunterladen
                    </span>
                    <span className={`text-sm ${currentStep === 3 ? 'text-[#ff7e0c]' : 'text-slate-600'}`}>
                      Dateien einzeln oder gesammelt herunterladen
                    </span>
                  </div>
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
