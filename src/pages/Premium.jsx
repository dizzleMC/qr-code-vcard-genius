import { useState } from "react";
import { toast } from "sonner";
import { PremiumLayout } from "@/components/premium/PremiumLayout";
import { PremiumStepIndicator } from "@/components/premium/PremiumStepIndicator";
import { ImportStep } from "@/components/premium/ImportStep";
import { TemplateStep } from "@/components/premium/TemplateStep";
import { GenerateStep } from "@/components/premium/GenerateStep";

const Premium = () => {
  const [templateSettings, setTemplateSettings] = useState({
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
    country: "Deutschland"
  });
  
  const handleTemplateChange = (setting, value) => {
    setTemplateSettings({
      ...templateSettings,
      [setting]: value
    });
  };
  
  const handleImportSuccess = data => {
    setImportedData(data);
    setCurrentStep(2);
  };

  const handleGenerateSelected = async selectedContacts => {
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

  const generateNameTag = async (contact, nameTagSettings) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      throw new Error("Canvas context could not be created");
    }
    
    const getDimensions = () => {
      switch(nameTagSettings.size) {
        case "small": return { width: 350, height: 175, fontSize: 18 };
        case "large": return { width: 450, height: 225, fontSize: 26 };
        case "medium":
        default: return { width: 400, height: 200, fontSize: 22 };
      }
    };
    
    const dimensions = getDimensions();
    
    const fillBackgroundWithGradient = () => {
      const bgcolor = nameTagSettings.backgroundColor || "#ffffff";
      const borderColor = nameTagSettings.borderColor || "#e2e8f0";
      let gradient;
      
      if (nameTagSettings.template === "modern" || nameTagSettings.template === "classic" || nameTagSettings.template === "minimal") {
        gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, bgcolor);
        gradient.addColorStop(0.85, bgcolor);
        gradient.addColorStop(1, borderColor + "20");
      } else {
        gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, bgcolor);
        gradient.addColorStop(0.85, bgcolor);
        gradient.addColorStop(1, borderColor + "20");
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };
    
    fillBackgroundWithGradient();
    
    ctx.strokeStyle = nameTagSettings.borderColor || "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
    
    let fontFamily = nameTagSettings.font || "Arial";
    if (!["Arial", "Helvetica", "Times New Roman", "Georgia"].includes(fontFamily)) {
      try {
        const fontFaceSet = document.fonts;
        const fontAvailable = fontFaceSet && await fontFaceSet.load(`16px ${fontFamily}`);
        if (!fontAvailable) {
          console.warn(`Font ${fontFamily} not available, falling back to system font.`);
          fontFamily = "Arial, sans-serif";
        }
      } catch (e) {
        console.warn(`Error checking font: ${e}. Falling back to system font.`);
        fontFamily = "Arial, sans-serif";
      }
    }
    
    const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || "Name";
    const company = (contact.company || '').trim();
    const title = (contact.title || '').trim();
    
    const getTemplatePosition = () => {
      switch(nameTagSettings.template) {
        case "modern":
          return {
            logoX: width * 0.75,
            logoY: 25,
            nameX: width * 0.25,
            nameY: height / 2 - 10,
            titleX: width * 0.25,
            titleY: height / 2 + 15,
            companyX: width * 0.25,
            companyY: height / 2 + 40,
            textAlign: "right"
          };
        case "business":
          return {
            logoX: width / 2,
            logoY: 40,
            nameX: width / 2,
            nameY: height / 2 + 10,
            titleX: width / 2,
            titleY: height / 2 + 35,
            companyX: width / 2,
            companyY: height / 2 + 60,
            textAlign: "center"
          };
        case "minimal":
          return {
            logoX: width * 0.25,
            logoY: 25,
            nameX: width / 2,
            nameY: height / 2 - 10,
            titleX: width / 2,
            titleY: height / 2 + 15,
            companyX: width / 2,
            companyY: height / 2 + 40,
            textAlign: "center"
          };
        case "classic":
        default:
          return {
            logoX: width * 0.25,
            logoY: 25,
            nameX: width * 0.25,
            nameY: height / 2 - 10,
            titleX: width * 0.25,
            titleY: height / 2 + 15,
            companyX: width * 0.25,
            companyY: height / 2 + 40,
            textAlign: "left"
          };
      }
    };
    
    const templatePosition = getTemplatePosition();
    
    if (nameTagSettings.logo) {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = nameTagSettings.logo;
      }).catch(err => {
        console.error("Error loading logo:", err);
      });
      
      if (img.complete && img.naturalWidth > 0) {
        const scale = nameTagSettings.logoScale / 100;
        const logoWidth = img.width * scale;
        const logoHeight = img.height * scale;
        const maxLogoHeight = height * 0.3;
        
        const ratio = Math.min(maxLogoHeight / logoHeight, 1);
        const finalLogoWidth = logoWidth * ratio;
        const finalLogoHeight = logoHeight * ratio;
        
        ctx.drawImage(
          img, 
          templatePosition.logoX - (finalLogoWidth / 2),
          templatePosition.logoY,
          finalLogoWidth,
          finalLogoHeight
        );
      }
    }
    
    ctx.textAlign = templatePosition.textAlign;
    
    const nameFontSize = Math.max(dimensions.fontSize, 18);
    const titleFontSize = Math.max(dimensions.fontSize - 6, 12);
    const companyFontSize = Math.max(dimensions.fontSize - 4, 14);
    
    ctx.font = `bold ${nameFontSize}px ${fontFamily}`;
    ctx.fillStyle = nameTagSettings.nameColor || "#1A1F2C";
    ctx.fillText(fullName, templatePosition.nameX, templatePosition.nameY);
    
    if (title) {
      ctx.font = `${titleFontSize}px ${fontFamily}`;
      ctx.fillStyle = nameTagSettings.companyColor || "#8E9196";
      ctx.fillText(title, templatePosition.titleX, templatePosition.titleY);
    }
    
    if (company) {
      ctx.font = `${companyFontSize}px ${fontFamily}`;
      ctx.fillStyle = nameTagSettings.companyColor || "#8E9196";
      ctx.fillText(company, templatePosition.companyX, templatePosition.companyY);
    }
    
    try {
      const {
        toCanvas
      } = await import('qrcode');
      
      const vcard = ["BEGIN:VCARD", "VERSION:3.0", `N:${contact.lastName || ''};${contact.firstName || ''};;;`, `FN:${contact.firstName || ''} ${contact.lastName || ''}`, contact.title && `TITLE:${contact.title}`, contact.company && `ORG:${contact.company}`, contact.email && `EMAIL:${contact.email}`, contact.phone && `TEL:${contact.phone}`, contact.website && `URL:${contact.website}`, (contact.street || contact.city) && `ADR:;;${contact.street || ''};${contact.city || ''};${contact.state || ''};${contact.zip || ''};${contact.country || ''}`, "END:VCARD"].filter(Boolean).join("\n");
      
      const qrCanvas = document.createElement("canvas");
      const qrSize = height * 0.7;
      
      await toCanvas(qrCanvas, vcard, {
        width: qrSize,
        margin: 1,
        color: {
          dark: nameTagSettings.qrFgColor || "#000000",
          light: nameTagSettings.qrBgColor || "#ffffff"
        },
        errorCorrectionLevel: 'M'
      });
      
      let qrX, qrY;
      
      switch(nameTagSettings.template) {
        case "modern":
          qrX = width * 0.8;
          qrY = height / 2;
          break;
        case "business":
          qrX = width - qrSize/2 - 15;
          qrY = height - qrSize/2 - 15;
          break;
        case "minimal":
          qrX = width * 0.8;
          qrY = height / 2;
          break;
        case "classic":
        default:
          qrX = width * 0.75;
          qrY = height / 2;
      }
      
      ctx.fillStyle = nameTagSettings.qrBgColor || "#ffffff";
      ctx.fillRect(qrX - (qrSize / 2) - 5, qrY - (qrSize / 2) - 5, qrSize + 10, qrSize + 10);
      
      ctx.drawImage(qrCanvas, qrX - (qrSize / 2), qrY - (qrSize / 2), qrSize, qrSize);
    } catch (error) {
      console.error("Error generating QR code for name tag:", error);
    }
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create name tag"));
      }, "image/png");
    });
  };

  const generateQRCodes = async contactsToGenerate => {
    setIsGenerating(true);
    setGenerationProgress(0);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      const {
        toCanvas
      } = await import('qrcode');
      let completedCount = 0;
      const totalContacts = contactsToGenerate.length;
      const totalItems = templateSettings.nameTag.enabled ? totalContacts * 2 : totalContacts;
      
      console.log(`Starting generation of ${totalContacts} QR codes${templateSettings.nameTag.enabled ? ' and name tags' : ''}`);

      const batchSize = 3;
      const batches = [];
      for (let i = 0; i < totalContacts; i += batchSize) {
        batches.push(contactsToGenerate.slice(i, i + batchSize));
      }
      console.log(`Split into ${batches.length} batches of max ${batchSize} contacts each`);

      for (const [batchIndex, batch] of batches.entries()) {
        console.log(`Processing batch ${batchIndex + 1}/${batches.length}`);

        const batchPromises = batch.map(async contact => {
          try {
            // Standardized vCard format
            const formattedFirstName = contact.academicTitle ? 
              `${contact.academicTitle} ${contact.firstName || ''}` : 
              (contact.firstName || '');
                
            console.log("Premium.jsx - Generating vCard for contact:", contact);
                
            const vcard = [
              "BEGIN:VCARD",
              "VERSION:3.0",
              `N:${contact.lastName || ''};${formattedFirstName};;;`,
              `FN:${formattedFirstName} ${contact.lastName || ''}`,
              `SOURCE:https://www.yourvcard.de/vcard/${contact.id || ''}`,
              contact.title && `TITLE:${contact.title}`,
              contact.title && `ROLE:${contact.title}`,
              contact.company && `ORG:${contact.company}`,
              contact.email && `EMAIL:${contact.email}`,
              contact.phone && `TEL;TYPE=voice:${contact.phone}`,
              contact.mobile && `TEL;TYPE=cell:${contact.mobile}`,
              contact.phone_work && `TEL;TYPE=work:${contact.phone_work}`,
              contact.website && `URL;TYPE=Website:${contact.website}`,
              (contact.street || contact.city) && 
                `ADR:;;${contact.street || ''};${contact.city || ''};${contact.state || ''};${contact.zip || ''};${contact.country || ''}`,
              "END:VCARD"
            ].filter(Boolean).join("\n");
            
            console.log("Premium.jsx - Generated vCard:", vcard);

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

            const qrBlob = await new Promise((resolve, reject) => {
              canvas.toBlob(blob => {
                if (blob) resolve(blob);else reject(new Error("Failed to create blob"));
              }, "image/png");
            });
            
            if (!qrBlob) {
              throw new Error("QR code blob creation failed");
            }
            
            console.log(`Generated QR code for ${contact.firstName} ${contact.lastName}, size: ${qrBlob.size} bytes`);
            const qrFileName = `${contact.firstName || 'contact'}-${contact.lastName || ''}-qr.png`;
            zip.file(qrFileName, qrBlob);
            
            completedCount++;
            const progress = completedCount / totalItems * 100;
            setGenerationProgress(progress);
            
            if (templateSettings.nameTag.enabled) {
              try {
                console.log(`Generating name tag for ${contact.firstName} ${contact.lastName}`);
                const nameTagBlob = await generateNameTag(contact, templateSettings.nameTag);
                const nameTagFileName = `${contact.firstName || 'contact'}-${contact.lastName || ''}-nametag.png`;
                zip.file(nameTagFileName, nameTagBlob);
                
                console.log(`Generated name tag for ${contact.firstName} ${contact.lastName}`);
              } catch (nameTagError) {
                console.error(`Error generating name tag: ${nameTagError}`);
                toast.error(`Fehler beim Erstellen des Namensschilds für ${contact.firstName} ${contact.lastName}`);
              } finally {
                completedCount++;
                const progress = completedCount / totalItems * 100;
                setGenerationProgress(progress);
              }
            }
          } catch (error) {
            console.error(`Error generating QR code for contact ${contact.firstName} ${contact.lastName}:`, error);
            throw error;
          }
        });

        try {
          await Promise.all(batchPromises);
        } catch (error) {
          console.error("Error in batch processing:", error);
          toast.error(`Ein Fehler ist aufgetreten: ${error.message}`);
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
            compressionOptions: {
              level: 6
            }
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
            
            const nameTagEnabled = templateSettings.nameTag.enabled;
            const successMessage = nameTagEnabled 
              ? `${totalContacts} QR-Codes und ${totalContacts} Namensschilder wurden erfolgreich generiert und heruntergeladen!`
              : `${totalContacts} QR-Codes wurden erfolgreich generiert und heruntergeladen!`;
            
            toast.success(successMessage);
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
      <div className="space-y-12">
        {/* Premium Step Indicator */}
        <PremiumStepIndicator 
          currentStep={currentStep} 
          completedSteps={[]} 
        />

        {/* Step Content with animations */}
        <div className="animate-fade-in">
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
      </div>
    </PremiumLayout>
  );
};
export default Premium;
