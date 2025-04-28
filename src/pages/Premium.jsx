
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
  
  // Modified to handle generation of only selected contacts
  const handleGenerateSelected = async (selectedContacts) => {
    if (selectedContacts.length === 0) {
      toast.error("Keine Kontakte ausgewählt.");
      return;
    }
    
    await generateQRCodes(selectedContacts);
  };
  
  // Modified to handle generation of all contacts
  const handleBulkGenerate = async () => {
    if (importedData.length === 0) {
      toast.error("Keine Daten zum Generieren vorhanden.");
      return;
    }
    
    await generateQRCodes(importedData);
  };
  
  // Extracted QR code generation logic into a separate function
  const generateQRCodes = async (contactsToGenerate) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      
      // Use direct QR code generation instead of a web worker
      // This helps debug and ensure proper generation
      const { toCanvas } = await import('qrcode');
      
      let completedCount = 0;
      const totalContacts = contactsToGenerate.length;
      
      // Process in smaller batches for better UI responsiveness
      const batchSize = 5;
      const batches = [];
      
      for (let i = 0; i < totalContacts; i += batchSize) {
        batches.push(contactsToGenerate.slice(i, i + batchSize));
      }
      
      for (const batch of batches) {
        await Promise.all(batch.map(async (contact) => {
          try {
            // Generate vCard data
            const vcard = [
              "BEGIN:VCARD",
              "VERSION:3.0",
              `N:${contact.lastName || ''};${contact.firstName || ''};;;`,
              `FN:${contact.firstName || ''} ${contact.lastName || ''}`,
              contact.title && `TITLE:${contact.title}`,
              contact.company && `ORG:${contact.company}`,
              contact.email && `EMAIL:${contact.email}`,
              contact.phone && `TEL:${contact.phone}`,
              contact.website && `URL:${contact.website}`,
              (contact.street || contact.city) && 
                `ADR:;;${contact.street || ''};${contact.city || ''};${contact.state || ''};${contact.zip || ''};${contact.country || ''}`,
              "END:VCARD"
            ].filter(Boolean).join("\n");
            
            // Create a canvas element
            const canvas = document.createElement("canvas");
            const options = {
              width: templateSettings.size,
              margin: 4,
              color: {
                dark: templateSettings.fgColor,
                light: templateSettings.bgColor
              }
            };
            
            // Generate QR code on canvas
            await toCanvas(canvas, vcard, options);
            
            // Convert to blob
            const blob = await new Promise(resolve => {
              canvas.toBlob(resolve, "image/png");
            });
            
            if (blob && blob.size > 0) {
              const fileName = `${contact.firstName || 'contact'}-${contact.lastName || ''}-qr.png`;
              zip.file(fileName, blob);
              console.log(`Added to zip: ${fileName}, size: ${blob.size} bytes`);
            } else {
              console.error(`Failed to create blob for contact: ${contact.firstName} ${contact.lastName}`);
              toast.error(`Fehler beim Generieren des QR-Codes für ${contact.firstName} ${contact.lastName}`);
            }
          } catch (error) {
            console.error(`Error generating QR code for contact ${contact.firstName} ${contact.lastName}:`, error);
            toast.error(`Fehler beim Erstellen des QR-Codes für ${contact.firstName} ${contact.lastName}`);
          } finally {
            completedCount++;
            const progress = (completedCount / totalContacts) * 100;
            setGenerationProgress(progress);
          }
        }));
      }
      
      // Create and download ZIP file
      const filesInZip = Object.keys(zip.files).length;
      console.log(`Files in zip: ${filesInZip}`);
      
      if (filesInZip > 0) {
        const content = await zip.generateAsync({ 
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 6 }
        });
        
        if (content && content.size > 0) {
          const downloadLink = document.createElement("a");
          const url = URL.createObjectURL(content);
          downloadLink.href = url;
          downloadLink.download = "qr-codes.zip";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 1000);
          
          toast.success(`${filesInZip} QR-Codes wurden erfolgreich generiert und heruntergeladen!`);
        } else {
          console.error("Generated ZIP has no size");
          toast.error("Die generierte ZIP-Datei ist leer. Bitte versuchen Sie es erneut.");
        }
      } else {
        toast.error("Es konnten keine QR-Codes generiert werden. Bitte versuchen Sie es erneut.");
      }
    } catch (error) {
      console.error("Fehler beim Generieren der QR-Codes:", error);
      toast.error("Fehler beim Generieren der QR-Codes. Bitte versuchen Sie es erneut.");
    } finally {
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
            templateSettings={templateSettings}
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            onGenerate={handleBulkGenerate}
            onGenerateSelected={handleGenerateSelected}
            onReset={resetProcess}
          />
        )}
      </div>
    </PremiumLayout>
  );
};

export default Premium;
