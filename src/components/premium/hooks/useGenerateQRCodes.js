
import { useState } from 'react';
import { toast } from 'sonner';
import { generateNameTag } from '@/utils/nameTagGenerator';
import { generateVCardData } from '@/utils/qrCodeUtils';

/**
 * Custom hook for QR code generation functionality
 * @returns {Object} QR code generation state and functions
 */
export const useGenerateQRCodes = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  /**
   * Generates QR codes for the given contacts
   * @param {Array} contactsToGenerate - List of contacts to generate QR codes for
   * @param {Object} templateSettings - Template settings
   */
  const generateQRCodes = async (contactsToGenerate, templateSettings) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      const { toCanvas } = await import('qrcode');
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
            const vcard = generateVCardData(contact);
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
                if (blob) resolve(blob);
                else reject(new Error("Failed to create blob"));
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
            
            if (templateSettings.nameTag?.enabled) {
              try {
                console.log(`Generating name tag for ${contact.firstName} ${contact.lastName}`);
                
                const nameTagBlob = await generateNameTag(contact, templateSettings.nameTag);
                
                if (!nameTagBlob) {
                  throw new Error("Name tag blob creation failed");
                }
                
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

  /**
   * Handles generating QR codes for selected contacts
   * @param {Array} selectedContacts - Selected contacts to generate QR codes for
   * @param {Object} templateSettings - Template settings
   */
  const handleGenerateSelected = async (selectedContacts, templateSettings) => {
    if (selectedContacts.length === 0) {
      toast.error("Keine Kontakte ausgewählt.");
      return;
    }
    await generateQRCodes(selectedContacts, templateSettings);
  };

  /**
   * Handles bulk QR code generation
   * @param {Array} importedData - All imported contacts
   * @param {Object} templateSettings - Template settings
   */
  const handleBulkGenerate = async (importedData, templateSettings) => {
    if (importedData.length === 0) {
      toast.error("Keine Daten zum Generieren vorhanden.");
      return;
    }
    await generateQRCodes(importedData, templateSettings);
  };

  return {
    isGenerating,
    generationProgress,
    handleGenerateSelected,
    handleBulkGenerate
  };
};
