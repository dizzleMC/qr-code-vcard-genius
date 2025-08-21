
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader, Download } from "lucide-react";
import { toast } from "sonner";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { NameTagPreview } from "./NameTagPreview";

export const QRCodePreviewGrid = ({
  contacts,
  templateSettings,
  onGenerateSelected,
  isGenerating
}) => {
  const [selectedContacts, setSelectedContacts] = useState(contacts.map((_, index) => index));
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 9;
  
  const generateVCardData = contact => {
    // Format the name with academic title if available
    const formattedFirstName = contact.academicTitle ? 
      `${contact.academicTitle} ${contact.firstName || ''}` : 
      (contact.firstName || '');
      
    console.log("QRCodePreviewGrid - Generating vCard for contact:", contact);
      
    // Standardized vCard format
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
    
    console.log("QRCodePreviewGrid - Generated vCard:", vcard);
    return vcard;
  };
  
  const totalPages = Math.ceil(contacts.length / contactsPerPage);
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);
  
  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((_, index) => index));
    }
  };
  
  const toggleContactSelection = index => {
    const actualIndex = indexOfFirstContact + index;
    if (selectedContacts.includes(actualIndex)) {
      setSelectedContacts(selectedContacts.filter(i => i !== actualIndex));
    } else {
      setSelectedContacts([...selectedContacts, actualIndex]);
    }
  };
  
  const handleGenerateSelected = () => {
    const selectedContactsData = selectedContacts.map(index => contacts[index]);
    onGenerateSelected(selectedContactsData);
  };
  
  const generateNameTag = async (contact, nameTagSettings) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      throw new Error("Canvas context could not be created");
    }
    
    // Get dimensions based on size setting - EXACTLY like NameTagPreview
    const getDimensions = () => {
      switch(nameTagSettings.size) {
        case "small": 
          return { width: 350, height: 175, qrSize: 110, fontSize: 18 };
        case "large": 
          return { width: 450, height: 225, qrSize: 160, fontSize: 26 };
        case "medium":
        default: 
          return { width: 400, height: 200, qrSize: 140, fontSize: 22 };
      }
    };
    
    const dimensions = getDimensions();
    const { width, height } = dimensions;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    const fillBackgroundWithGradient = () => {
      const bgcolor = nameTagSettings.backgroundColor || "#ffffff";
      const borderColor = nameTagSettings.borderColor || "#e2e8f0";
      let gradient;
      
      // Match EXACT gradient positioning from NameTagPreview
      switch(nameTagSettings.template) {
        case "modern":
          gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, bgcolor);
          gradient.addColorStop(0.7, bgcolor);
          gradient.addColorStop(1, borderColor + "20");
          break;
        case "business":
          gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, bgcolor);
          gradient.addColorStop(0.85, bgcolor);
          gradient.addColorStop(1, borderColor + "20");
          break;
        case "minimal":
          gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, bgcolor);
          gradient.addColorStop(0.9, bgcolor);
          gradient.addColorStop(1, borderColor + "10");
          break;
        case "classic":
        default:
          gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, bgcolor);
          gradient.addColorStop(0.85, bgcolor);
          gradient.addColorStop(1, borderColor + "15");
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };
    
    // Fill background with solid color (no gradient to match preview)
    ctx.fillStyle = nameTagSettings.backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, width, height);
    
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
    
    // Format name with academic title - EXACTLY like NameTagPreview
    const academicTitle = contact.academicTitle || '';
    const firstName = contact.firstName || '';
    const lastName = contact.lastName || '';
    
    // Ensure proper spacing between all parts
    const nameParts = [academicTitle, firstName, lastName].filter(part => part.trim() !== '');
    const displayName = nameParts.join(' ');
    const fullName = displayName || "Name";
    const company = (contact.company || '').trim();
    const title = (contact.title || '').trim();
    
    const getTemplatePosition = () => {
      switch(nameTagSettings.template) {
        case "modern":
          return {
            logoX: width * 0.75,
            logoY: 25,
            nameX: width * 0.65,
            nameY: height / 2 - 10,
            titleX: width * 0.65,
            titleY: height / 2 + 15,
            companyX: width * 0.65,
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
    
    // Generate QR code for name tag
    try {
      const { toCanvas } = await import('qrcode');
      
      // Generate vCard data with academicTitle support  
      const academicTitle = contact.academicTitle || '';
      const formattedFirstName = academicTitle ? `${academicTitle} ${contact.firstName || ''}`.trim() : contact.firstName || '';
      
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
      
      const qrCanvas = document.createElement("canvas");
      const qrSize = dimensions.qrSize;
      
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
      
      // Position QR code EXACTLY like in NameTagPreview
      switch(nameTagSettings.template) {
        case "modern":
          qrX = qrSize/2 + 16; // Left side, centered vertically
          qrY = height / 2;
          break;
        case "business":
          qrX = width - qrSize/2 - 10; // Bottom right corner
          qrY = height - qrSize/2 - 10;
          break;
        case "minimal":
          qrX = width - qrSize/2 - 16; // Right side, centered vertically  
          qrY = height / 2;
          break;
        case "classic":
        default:
          qrX = width - qrSize/2 - 16; // Right side, centered vertically
          qrY = height / 2;
      }
      
      // Draw QR code background
      ctx.fillStyle = nameTagSettings.qrBgColor || "#ffffff";
      ctx.fillRect(qrX - (qrSize / 2) - 5, qrY - (qrSize / 2) - 5, qrSize + 10, qrSize + 10);
      
      // Draw the QR code
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

  const handleDownloadSingle = async (contact, type = 'qrcode') => {
    if (type === 'qrcode') {
      try {
        const { toCanvas } = await import('qrcode');
        const canvas = document.createElement("canvas");
        
        await toCanvas(canvas, generateVCardData(contact), {
          width: templateSettings.size || 200,
          margin: 4,
          color: {
            dark: templateSettings.fgColor || "#1A1F2C",
            light: templateSettings.bgColor || "#ffffff"
          },
          errorCorrectionLevel: 'H'
        });

        // Add logo overlay if logo exists
        if (templateSettings.logo) {
          const ctx = canvas.getContext('2d');
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = templateSettings.logo;
          });

          if (img.complete && img.naturalWidth > 0) {
            const logoSizePx = ((templateSettings.logoSize || 20) / 100) * canvas.width;
            const logoX = (canvas.width - logoSizePx) / 2;
            const logoY = (canvas.height - logoSizePx) / 2;
            
            // Draw white background for logo
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(logoX - 4, logoY - 4, logoSizePx + 8, logoSizePx + 8);
            
            // Draw logo with opacity
            ctx.globalAlpha = templateSettings.logoOpacity || 1;
            ctx.drawImage(img, logoX, logoY, logoSizePx, logoSizePx);
            ctx.globalAlpha = 1;
          }
        }
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${contact.firstName || 'qrcode'}-${contact.lastName || 'contact'}-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        
        toast.success("QR-Code wurde heruntergeladen!");
      } catch (error) {
        console.error("Error generating QR code:", error);
        toast.error("Fehler beim Erstellen des QR-Codes.");
      }
    } else if (type === 'nametag' && templateSettings.nameTag?.enabled) {
      try {
        const nameTagBlob = await generateNameTag(contact, templateSettings.nameTag);
        const pngFile = URL.createObjectURL(nameTagBlob);
        const downloadLink = document.createElement("a");
        downloadLink.download = `${contact.firstName || 'contact'}-${contact.lastName || ''}-nametag.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        URL.revokeObjectURL(pngFile);
        toast.success("Namensschild wurde heruntergeladen!");
      } catch (error) {
        console.error("Error generating name tag:", error);
        toast.error("Fehler beim Erstellen des Namensschilds.");
      }
    }
  };

  return <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="select-all" checked={selectedContacts.length === contacts.length} onCheckedChange={toggleSelectAll} className="text-[#ff7e0c]" />
          <label htmlFor="select-all" className="text-[#8E9196]">
            Alle auswählen ({selectedContacts.length}/{contacts.length})
          </label>
        </div>
        
        <Button onClick={handleGenerateSelected} disabled={isGenerating || selectedContacts.length === 0} className="bg-[#ff7e0c] text-white font-medium transition-colors hover:bg-[#e67008]">
          {isGenerating ? <span className="flex items-center gap-2">
              <Loader className="animate-spin" size={16} />
              Generiere...
            </span> : `${selectedContacts.length} ${templateSettings.nameTag?.enabled ? 'QR-Codes & Namensschilder' : 'QR-Codes'} herunterladen`}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentContacts.map((contact, index) => {
        const actualIndex = indexOfFirstContact + index;
        return <div key={actualIndex} className={`bg-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${selectedContacts.includes(actualIndex) ? 'ring-2 ring-[#ff7e0c] ring-opacity-50' : 'border border-gray-100'}`}>
              <div className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox id={`contact-${actualIndex}`} checked={selectedContacts.includes(actualIndex)} onCheckedChange={() => toggleContactSelection(index)} className="text-[#ff7e0c]" />
                    <div>
                      <h3 className="font-medium text-[#1A1F2C] truncate max-w-[180px]">
                        {contact.academicTitle && `${contact.academicTitle} `}{contact.firstName} {contact.lastName}
                      </h3>
                      {contact.company && <p className="text-sm text-[#8E9196] truncate max-w-[180px]">
                          {contact.company}
                        </p>}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* QR Code Preview */}
                  <div className="bg-[#F9FAFB] rounded-lg p-4 flex justify-center">
                    <div id={`qr-code-${contact.firstName}-${contact.lastName}`} className="p-2 bg-white rounded-lg shadow-sm relative">
                      <QRCodeSVG 
                        value={generateVCardData(contact)} 
                        size={120} 
                        level="H" 
                        includeMargin={true} 
                        fgColor={templateSettings.fgColor} 
                        bgColor={templateSettings.bgColor} 
                      />
                      {templateSettings.logo && (
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded"
                          style={{
                            width: `${(templateSettings.logoSize / 100) * 120}px`,
                            height: `${(templateSettings.logoSize / 100) * 120}px`,
                            opacity: templateSettings.logoOpacity || 1
                          }}
                        >
                          <img 
                            src={templateSettings.logo} 
                            alt="Logo" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name Tag Preview (if enabled) */}
                  {templateSettings.nameTag?.enabled && (
                    <div className="flex justify-center overflow-hidden rounded-lg">
                      <div className="transform scale-75 origin-center">
                        <NameTagPreview
                          name={`${contact.academicTitle ? contact.academicTitle + ' ' : ''}${contact.firstName} ${contact.lastName}`}
                          company={contact.company}
                          title={contact.title}
                          settings={templateSettings.nameTag}
                          qrValue={generateVCardData(contact)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Download buttons */}
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadSingle(contact, 'qrcode')} 
                    className="w-full flex items-center justify-center gap-2 text-[#1A1F2C] hover:bg-[#ff7e0c] hover:text-white hover:border-[#ff7e0c]"
                  >
                    <Download size={16} />
                    QR-Code herunterladen
                  </Button>
                  
                  {templateSettings.nameTag?.enabled && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleDownloadSingle(contact, 'nametag')} 
                      className="w-full flex items-center justify-center gap-2 text-[#1A1F2C] hover:bg-[#ff7e0c] hover:text-white hover:border-[#ff7e0c]"
                    >
                      <Download size={16} />
                      Namensschild herunterladen
                    </Button>
                  )}
                </div>
              </div>
            </div>;
      })}
      </div>

      {totalPages > 1 && <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            </PaginationItem>
            
            {Array.from({
          length: Math.min(5, totalPages)
        }).map((_, i) => {
          let pageNumber;
          if (totalPages <= 5) {
            pageNumber = i + 1;
          } else if (currentPage <= 3) {
            pageNumber = i + 1;
            if (i === 4) pageNumber = totalPages;
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + i;
            if (i === 0) pageNumber = 1;
          } else {
            pageNumber = currentPage - 2 + i;
            if (i === 0) pageNumber = 1;
            if (i === 4) pageNumber = totalPages;
          }
          return <PaginationItem key={i}>
                  {i === 1 && pageNumber !== 2 && totalPages > 5 || i === 3 && pageNumber !== totalPages - 1 && totalPages > 5 ? <PaginationEllipsis /> : <PaginationLink isActive={currentPage === pageNumber} onClick={() => setCurrentPage(pageNumber)}>
                      {pageNumber}
                    </PaginationLink>}
                </PaginationItem>;
        })}
            
            <PaginationItem>
              <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>}
    </div>;
};
