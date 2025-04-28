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
    const vcard = ["BEGIN:VCARD", "VERSION:3.0", `N:${contact.lastName || ''};${contact.firstName || ''};;;`, `FN:${contact.firstName || ''} ${contact.lastName || ''}`, contact.title && `TITLE:${contact.title}`, contact.company && `ORG:${contact.company}`, contact.email && `EMAIL:${contact.email}`, contact.phone && `TEL:${contact.phone}`, contact.website && `URL:${contact.website}`, (contact.street || contact.city) && `ADR:;;${contact.street || ''};${contact.city || ''};${contact.state || ''};${contact.zip || ''};${contact.country || ''}`, "END:VCARD"].filter(Boolean).join("\n");
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

  const measureText = (ctx, text, font) => {
    ctx.font = font;
    const metrics = ctx.measureText(text);
    return {
      width: metrics.width,
      height: parseInt(font, 10) * 1.2
    };
  };
  
  const handleDownloadSingle = async (contact, type = 'qrcode') => {
    if (type === 'qrcode') {
      const svg = document.querySelector(`#qr-code-${contact.firstName}-${contact.lastName} svg`);
      if (!svg) {
        toast.error("QR-Code konnte nicht generiert werden.");
        return;
      }
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error("Browser unterstützt keine Canvas-Funktionalität.");
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = templateSettings.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${contact.firstName || 'qrcode'}-${contact.lastName || 'contact'}-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success("QR-Code wurde heruntergeladen!");
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } else if (type === 'nametag' && templateSettings.nameTag?.enabled) {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          toast.error("Browser unterstützt keine Canvas-Funktionalität.");
          return;
        }
        
        const getDimensions = () => {
          switch(templateSettings.nameTag.size) {
            case "small": return { width: 350, height: 175, fontSize: 18 };
            case "large": return { width: 450, height: 225, fontSize: 26 };
            case "medium":
            default: return { width: 400, height: 200, fontSize: 22 };
          }
        };
        
        const settings = templateSettings.nameTag;
        const { width, height } = getDimensions();
        canvas.width = width;
        canvas.height = height;
        
        ctx.fillStyle = settings.backgroundColor || "#ffffff";
        ctx.fillRect(0, 0, width, height);
        
        const template = settings.template || "classic";
        const borderColor = settings.borderColor || "#e2e8f0";
        
        let gradient;
        if (template === "modern") {
          gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, settings.backgroundColor || "#ffffff");
          gradient.addColorStop(0.7, settings.backgroundColor || "#ffffff");
          gradient.addColorStop(1, borderColor + "30");
        } else if (template === "business") {
          gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, settings.backgroundColor || "#ffffff");
          gradient.addColorStop(0.7, settings.backgroundColor || "#ffffff");
          gradient.addColorStop(1, borderColor + "30");
        } else if (template === "minimal") {
          gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, settings.backgroundColor || "#ffffff");
          gradient.addColorStop(0.85, settings.backgroundColor || "#ffffff");
          gradient.addColorStop(1, borderColor + "15");
        } else {
          gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, settings.backgroundColor || "#ffffff");
          gradient.addColorStop(0.75, settings.backgroundColor || "#ffffff");
          gradient.addColorStop(1, borderColor + "25");
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);
        
        const fontFamily = settings.font || 'Arial';
        const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || "Name";
        const company = (contact.company || '').trim();
        const title = (contact.title || '').trim();
        
        const nameFontSize = Math.max(dimensions.fontSize, 18);
        const titleFontSize = Math.max(dimensions.fontSize - 6, 12);
        const companyFontSize = Math.max(dimensions.fontSize - 4, 14);
        
        const nameFont = `bold ${nameFontSize}px ${fontFamily}`;
        const titleFont = `${titleFontSize}px ${fontFamily}`;
        const companyFont = `${companyFontSize}px ${fontFamily}`;
        
        const qrSize = template === "business" ? height * 0.65 : height * 0.7;
        
        const getTemplatePosition = () => {
          switch(template) {
            case "modern":
              return {
                nameX: width * 0.88,
                nameY: height / 2 - 10,
                titleX: width * 0.88,
                titleY: height / 2 + titleFontSize + 5,
                companyX: width * 0.88,
                companyY: height / 2 + titleFontSize + companyFontSize + 15,
                qrX: width * 0.3,
                qrY: height / 2,
                logoX: width * 0.88,
                logoY: height * 0.15,
                logoAlign: "right",
                textAlign: "right",
                qrSize: qrSize
              };
            case "business":
              return {
                nameX: width / 2,
                nameY: height * 0.5 - 10,
                titleX: width / 2,
                titleY: height * 0.5 + titleFontSize + 5,
                companyX: width / 2,
                companyY: height * 0.5 + titleFontSize + companyFontSize + 15,
                qrX: width - qrSize/2 - 15,
                qrY: height - qrSize/2 - 10,
                logoX: width / 2,
                logoY: height * 0.2,
                logoAlign: "center",
                textAlign: "center",
                qrSize: qrSize
              };
            case "minimal":
              return {
                nameX: width / 2,
                nameY: height / 2 - 10,
                titleX: width / 2,
                titleY: height / 2 + titleFontSize + 5,
                companyX: width / 2,
                companyY: height / 2 + titleFontSize + companyFontSize + 15,
                qrX: width - qrSize/1.6,
                qrY: height / 2,
                logoX: width * 0.2,
                logoY: height / 2,
                logoAlign: "center",
                textAlign: "center",
                qrSize: qrSize
              };
            case "classic":
            default:
              return {
                nameX: width * 0.08,
                nameY: height / 2 - 10,
                titleX: width * 0.08,
                titleY: height / 2 + titleFontSize + 5,
                companyX: width * 0.08,
                companyY: height / 2 + titleFontSize + companyFontSize + 15,
                qrX: width - qrSize/1.6,
                qrY: height / 2,
                logoX: width * 0.08,
                logoY: height * 0.15,
                logoAlign: "left",
                textAlign: "left",
                qrSize: qrSize
              };
          }
        };
        
        const templatePosition = getTemplatePosition();
        ctx.textAlign = templatePosition.textAlign;
        
        const qrBackgroundPadding = 10;
        ctx.fillStyle = settings.qrBgColor || "#ffffff";
        ctx.fillRect(
          templatePosition.qrX - (templatePosition.qrSize / 2) - qrBackgroundPadding/2, 
          templatePosition.qrY - (templatePosition.qrSize / 2) - qrBackgroundPadding/2, 
          templatePosition.qrSize + qrBackgroundPadding, 
          templatePosition.qrSize + qrBackgroundPadding
        );
        
        if (settings.logo) {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = settings.logo;
          }).catch(err => {
            console.error("Error loading logo:", err);
          });
          
          if (img.complete && img.naturalWidth > 0) {
            const scale = settings.logoScale / 100;
            const logoWidth = img.width * scale;
            const logoHeight = img.height * scale;
            const maxLogoHeight = height * 0.3;
            const maxLogoWidth = width * 0.6;
            
            const ratio = Math.min(
              maxLogoHeight / logoHeight, 
              maxLogoWidth / logoWidth, 
              1
            );
            
            const finalLogoWidth = logoWidth * ratio;
            const finalLogoHeight = logoHeight * ratio;
            
            let logoXPos;
            if (templatePosition.logoAlign === "center") {
              logoXPos = templatePosition.logoX - (finalLogoWidth / 2);
            } else if (templatePosition.logoAlign === "right") {
              logoXPos = templatePosition.logoX - finalLogoWidth;
            } else {
              logoXPos = templatePosition.logoX;
            }
              
            ctx.drawImage(
              img, 
              logoXPos,
              templatePosition.logoY - (finalLogoHeight / 2),
              finalLogoWidth,
              finalLogoHeight
            );
          }
        }
        
        try {
          const vcard = generateVCardData(contact);
          const { toCanvas } = await import('qrcode');
          
          const qrCanvas = document.createElement("canvas");
          
          await toCanvas(qrCanvas, vcard, {
            width: templatePosition.qrSize,
            margin: 1,
            color: {
              dark: settings.qrFgColor || "#000000",
              light: settings.qrBgColor || "#ffffff"
            },
            errorCorrectionLevel: 'M'
          });
          
          ctx.drawImage(
            qrCanvas, 
            templatePosition.qrX - (templatePosition.qrSize / 2), 
            templatePosition.qrY - (templatePosition.qrSize / 2), 
            templatePosition.qrSize, 
            templatePosition.qrSize
          );
        } catch (qrError) {
          console.error("Error generating QR code for name tag:", qrError);
        }
        
        const truncateText = (text, maxWidth) => {
          if (!text) return '';
          
          let truncated = text;
          ctx.save();
          
          if (text === fullName) ctx.font = nameFont;
          else if (text === title) ctx.font = titleFont;
          else ctx.font = companyFont;
          
          while (ctx.measureText(truncated).width > maxWidth && truncated.length > 0) {
            truncated = truncated.slice(0, -1);
          }
          
          ctx.restore();
          
          if (truncated !== text && truncated.length > 3) {
            truncated = truncated.slice(0, -3) + '...';
          }
          
          return truncated;
        };
        
        const textPadding = 15;
        let maxNameWidth;
        
        if (template === "business") {
          maxNameWidth = width * 0.8;
        } else if (templatePosition.textAlign === "center") {
          maxNameWidth = width * 0.6;
        } else if (templatePosition.textAlign === "right") {
          maxNameWidth = width * 0.5;
        } else {
          maxNameWidth = width - templatePosition.qrSize - textPadding * 3;
        }
        
        ctx.font = nameFont;
        ctx.fillStyle = settings.nameColor || "#1A1F2C";
        const truncatedName = truncateText(fullName, maxNameWidth);
        ctx.fillText(truncatedName, templatePosition.nameX, templatePosition.nameY);
        
        if (title) {
          ctx.font = titleFont;
          ctx.fillStyle = settings.companyColor || "#8E9196";
          const maxTitleWidth = maxNameWidth;
          const truncatedTitle = truncateText(title, maxTitleWidth);
          ctx.fillText(truncatedTitle, templatePosition.titleX, templatePosition.titleY);
        }
        
        if (company) {
          ctx.font = companyFont;
          ctx.fillStyle = settings.companyColor || "#8E9196";
          const maxCompanyWidth = maxNameWidth;
          const truncatedCompany = truncateText(company, maxCompanyWidth);
          ctx.fillText(truncatedCompany, templatePosition.companyX, templatePosition.companyY);
        }
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${contact.firstName || 'contact'}-${contact.lastName || ''}-nametag.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
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
                        {contact.firstName} {contact.lastName}
                      </h3>
                      {contact.company && <p className="text-sm text-[#8E9196] truncate max-w-[180px]">
                          {contact.company}
                        </p>}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-[#F9FAFB] rounded-lg p-4 flex justify-center">
                    <div id={`qr-code-${contact.firstName}-${contact.lastName}`} className="p-2 bg-white rounded-lg shadow-sm">
                      <QRCodeSVG 
                        value={generateVCardData(contact)} 
                        size={120} 
                        level="H" 
                        includeMargin={true} 
                        fgColor={templateSettings.fgColor} 
                        bgColor={templateSettings.bgColor} 
                      />
                    </div>
                  </div>

                  {templateSettings.nameTag?.enabled && (
                    <div className="flex justify-center overflow-hidden rounded-lg">
                      <div className="transform scale-75 origin-center">
                        <NameTagPreview
                          name={`${contact.firstName} ${contact.lastName}`}
                          company={contact.company}
                          title={contact.title}
                          settings={templateSettings.nameTag}
                          qrValue={generateVCardData(contact)}
                        />
                      </div>
                    </div>
                  )}
                </div>

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
