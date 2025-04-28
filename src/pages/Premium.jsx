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
  
  const handleGenerateSelected = async (selectedContacts) => {
    if (selectedContacts.length === 0) {
      toast.error("Keine Kontakte ausgewählt.");
      return;
    }
    
    await generateQRCodes(selectedContacts);
  };
  
  const handleBulkGenerate = async () => {
    if (importedData.length === 0) {
      toast.error("Keine Daten zum Generieren vorhanden.");
      return;
    }
    
    await generateQRCodes(importedData);
  };
  
  const generateQRCodes = async (contactsToGenerate) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      
      const { toCanvas } = await import('qrcode');
      
      let completedCount = 0;
      const totalContacts = contactsToGenerate.length;
      console.log(`Starting generation of ${totalContacts} QR codes`);
      
      const batchSize = 3;
      const batches = [];
      
      for (let i = 0; i < totalContacts; i += batchSize) {
        batches.push(contactsToGenerate.slice(i, i + batchSize));
      }
      
      console.log(`Split into ${batches.length} batches of max ${batchSize} contacts each`);
      
      for (const [batchIndex, batch] of batches.entries()) {
        console.log(`Processing batch ${batchIndex + 1}/${batches.length}`);
        
        const batchPromises = batch.map(async (contact) => {
          try {
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
            
            const canvas = document.createElement("canvas");
            const options = {
              width: templateSettings.size || 200,
              margin: 4,
              color: {
                dark: templateSettings.fgColor || "#1A1F2C",
                light: templateSettings.bgColor || "#ffffff"
              },
              errorCorrectionLevel: 'H'
            };
            
            console.log(`Generating QR code for ${contact.firstName} ${contact.lastName}`);
            
            await toCanvas(canvas, vcard, options);
            
            const blob = await new Promise((resolve, reject) => {
              canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Failed to create blob"));
              }, "image/png");
            });
            
            if (!blob) {
              throw new Error("Blob creation failed");
            }
            
            console.log(`Generated QR code for ${contact.firstName} ${contact.lastName}, size: ${blob.size} bytes`);
            
            const fileName = `${contact.firstName || 'contact'}-${contact.lastName || ''}-qr.png`;
            zip.file(fileName, blob);
            
          } catch (error) {
            console.error(`Error generating QR code for contact ${contact.firstName} ${contact.lastName}:`, error);
            throw error;
          } finally {
            completedCount++;
            const progress = (completedCount / totalContacts) * 100;
            setGenerationProgress(progress);
            console.log(`Progress: ${Math.round(progress)}%`);
          }
        });
        
        try {
          await Promise.all(batchPromises);
        } catch (error) {
          console.error("Error in batch processing:", error);
          toast.error(`Ein Fehler ist aufgetreten: ${error.message}`);
          // We'll continue to the next batch despite errors
        }
      }
      
      const filesInZip = Object.keys(zip.files).length;
      console.log(`Files in zip: ${filesInZip}`);
      
      if (filesInZip > 0) {
        try {
          console.log("Generating final ZIP file...");
          const content = await zip.generateAsync({ 
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 }
          });
          
          console.log(`ZIP generated, size: ${content.size} bytes`);
          
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
        } catch (error) {
          console.error("Error generating ZIP:", error);
          toast.error(`Fehler beim Erstellen der ZIP-Datei: ${error.message}`);
        }
      } else {
        toast.error("Es konnten keine QR-Codes generiert werden. Bitte versuchen Sie es erneut.");
      }
    } catch (error) {
      console.error("Fehler beim Generieren der QR-Codes:", error);
      toast.error(`Fehler beim Generieren der QR-Codes: ${error.message}`);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <ImportStep onImportSuccess={handleImportSuccess} />
        </div>
        
        <div className="col-span-1">
          <TemplateStep
            templateData={templateData}
            templateSettings={templateSettings}
            importedData={importedData}
            selectedContact={selectedContact}
            onTemplateChange={handleTemplateChange}
            onSelectContact={setSelectedContact}
            onNextStep={() => setCurrentStep(3)}
          />
        </div>
        
        <div className="col-span-1">
          <GenerateStep
            importedData={importedData}
            templateSettings={templateSettings}
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            onGenerate={handleBulkGenerate}
            onGenerateSelected={handleGenerateSelected}
            onReset={resetProcess}
          />
        </div>
      </div>
    </PremiumLayout>
  );
};

export default Premium;
