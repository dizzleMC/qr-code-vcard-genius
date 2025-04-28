
import { useState } from "react";
import { toast } from "sonner";
import { PremiumLayout } from "@/components/premium/PremiumLayout";
import { ImportStep } from "@/components/premium/ImportStep";
import { TemplateStep } from "@/components/premium/TemplateStep";
import { GenerateStep } from "@/components/premium/GenerateStep";

const Premium = () => {
  const [templateSettings, setTemplateSettings] = useState({
    size: 200,
    fgColor: "#1A1F2C",
    bgColor: "#ffffff"
  });
  
  const [importedData, setImportedData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  const [templateData, setTemplateData] = useState({
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
    country: "Deutschland",
  });
  
  const handleTemplateChange = (setting, value) => {
    setTemplateSettings({
      ...templateSettings,
      [setting]: value
    });
  };
  
  const handleImportSuccess = (data) => {
    setImportedData(data);
    setCurrentStep(2);
  };
  
  const handleBulkGenerate = async () => {
    if (importedData.length === 0) {
      toast.error("Keine Daten zum Generieren vorhanden.");
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const worker = new Worker(new URL('../workers/qrWorker.js', import.meta.url), { type: 'module' });
      
      let completedTasks = 0;
      
      worker.onmessage = async (e) => {
        const { success, fileName, blob, progress, error } = e.data;
        
        if (success) {
          if (blob instanceof Blob && blob.size > 0) {
            zip.file(fileName, blob);
            console.log(`Added to zip: ${fileName}, size: ${blob.size} bytes`);
          } else {
            console.error(`Invalid blob for ${fileName}:`, blob);
            toast.error(`Fehler beim Generieren von ${fileName}`);
          }
        } else {
          console.error(`Error generating QR code: ${error}`);
          toast.error(`Fehler beim Generieren eines QR-Codes: ${error}`);
        }
        
        setGenerationProgress(progress);
        completedTasks++;
        
        if (completedTasks === importedData.length) {
          const filesInZip = Object.keys(zip.files).length;
          console.log(`Files in zip: ${filesInZip}`);
          
          if (filesInZip > 0) {
            const content = await zip.generateAsync({ 
              type: "blob",
              compression: "DEFLATE",
              compressionOptions: { level: 6 }
            });
            
            if (content.size > 0) {
              const downloadLink = document.createElement("a");
              const url = URL.createObjectURL(content);
              downloadLink.href = url;
              downloadLink.download = "qr-codes.zip";
              downloadLink.click();
              
              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 1000);
              
              toast.success("QR-Codes wurden erfolgreich generiert und heruntergeladen!");
              setCurrentStep(3);
            } else {
              toast.error("Die generierte ZIP-Datei ist leer. Bitte versuchen Sie es erneut.");
            }
          } else {
            toast.error("Es konnten keine QR-Codes generiert werden. Bitte versuchen Sie es erneut.");
          }
          
          worker.terminate();
          setIsGenerating(false);
        }
      };
      
      importedData.forEach((contact, index) => {
        worker.postMessage({
          contact,
          settings: templateSettings,
          index: index,
          total: importedData.length
        });
      });
      
    } catch (error) {
      console.error("Fehler beim Generieren der QR-Codes:", error);
      toast.error("Fehler beim Generieren der QR-Codes. Bitte versuchen Sie es erneut.");
      setIsGenerating(false);
    }
  };
  
  const resetProcess = () => {
    setImportedData([]);
    setCurrentStep(1);
    toast.info("Prozess zurückgesetzt. Sie können neue Kontakte importieren.");
  };

  return (
    <PremiumLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "600px",
          margin: "0 auto 2rem auto"
        }}>
          {[1, 2, 3].map((step) => (
            <div key={step} style={{
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
              <span style={{ color: currentStep >= step ? "#1A1F2C" : "#8E9196" }}>
                {step === 1 && "Daten importieren"}
                {step === 2 && "Template anpassen"}
                {step === 3 && "QR-Codes generieren"}
              </span>
            </div>
          ))}
        </div>

        {currentStep === 1 && (
          <ImportStep onImportSuccess={handleImportSuccess} />
        )}
        
        {currentStep === 2 && (
          <TemplateStep
            templateData={templateData}
            templateSettings={templateSettings}
            importedData={importedData}
            selectedContact={selectedContact}
            onTemplateChange={handleTemplateChange}
            onSelectContact={setSelectedContact}
            onNextStep={() => setCurrentStep(3)}
          />
        )}
        
        {currentStep === 3 && (
          <GenerateStep
            importedData={importedData}
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            onGenerate={handleBulkGenerate}
            onReset={resetProcess}
          />
        )}
      </div>
    </PremiumLayout>
  );
};

export default Premium;
