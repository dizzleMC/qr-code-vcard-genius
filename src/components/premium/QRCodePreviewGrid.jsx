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
            case "small": return { width: 350, height: 175 };
            case "large": return { width: 450, height: 225 };
            case "medium":
            default: return { width: 400, height: 200 };
          }
        };
        
        const dimensions = getDimensions();
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        
        const nameTagSettings = templateSettings.nameTag;
        
        ctx.fillStyle = nameTagSettings.backgroundColor || "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = nameTagSettings.borderColor || "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
        
        const fontFamily = nameTagSettings.font || 'Arial';
        const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || "Name";
        const company = (contact.company || '').trim();
        const title = (contact.title || '').trim();
        
        const template = nameTagSettings.template || "classic";
        let nameX, nameY, titleX, titleY, companyX, companyY, qrX, qrY;
        
        if (template === "modern") {
          nameX = canvas.width * 0.25;
          nameY = canvas.height / 2 - 10;
          titleX = canvas.width * 0.25;
          titleY = canvas.height / 2 + 15;
          companyX = canvas.width * 0.25;
          companyY = canvas.height / 2 + 40;
          qrX = canvas.width * 0.75;
          qrY = canvas.height / 2;
          ctx.textAlign = "left";
        } else if (template === "business") {
          nameX = canvas.width / 2;
          nameY = canvas.height / 2 + 10;
          titleX = canvas.width / 2;
          titleY = canvas.height / 2 + 35;
          companyX = canvas.width / 2;
          companyY = canvas.height / 2 + 60;
          qrX = canvas.width - (canvas.height * 0.35) - 15;
          qrY = canvas.height - (canvas.height * 0.35) - 15;
          ctx.textAlign = "center";
        } else if (template === "minimal") {
          nameX = canvas.width / 2;
          nameY = canvas.height / 2 - 10;
          titleX = canvas.width / 2;
          titleY = canvas.height / 2 + 15;
          companyX = canvas.width / 2;
          companyY = canvas.height / 2 + 40;
          qrX = canvas.width * 0.8;
          qrY = canvas.height / 2;
          ctx.textAlign = "center";
        } else { // classic
          nameX = canvas.width * 0.25;
          nameY = canvas.height / 2 - 10;
          titleX = canvas.width * 0.25;
          titleY = canvas.height / 2 + 15;
          companyX = canvas.width * 0.25;
          companyY = canvas.height / 2 + 40;
          qrX = canvas.width * 0.75;
          qrY = canvas.height / 2;
          ctx.textAlign = "left";
        }
        
        ctx.font = `bold ${nameTagSettings.fontSize || 22}px ${fontFamily}`;
        ctx.fillStyle = nameTagSettings.nameColor || "#1A1F2C";
        ctx.fillText(fullName, nameX, nameY);
        
        if (title) {
          ctx.font = `${(nameTagSettings.fontSize || 22) - 4}px ${fontFamily}`;
          ctx.fillStyle = nameTagSettings.companyColor || "#8E9196";
          ctx.fillText(title, titleX, titleY);
        }
        
        if (company) {
          ctx.font = `${(nameTagSettings.fontSize || 22) - 2}px ${fontFamily}`;
          ctx.fillStyle = nameTagSettings.companyColor || "#8E9196";
          ctx.fillText(company, companyX, companyY);
        }
        
        const vcard = ["BEGIN:VCARD", "VERSION:3.0", 
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
        
        const {
          toCanvas
        } = await import('qrcode');
        
        const qrCanvas = document.createElement("canvas");
        const qrSize = canvas.height * 0.7;
        
        await toCanvas(qrCanvas, vcard, {
          width: qrSize,
          margin: 1,
          color: {
            dark: nameTagSettings.qrFgColor || "#000000",
            light: nameTagSettings.qrBgColor || "#ffffff"
          },
          errorCorrectionLevel: 'M'
        });
        
        ctx.fillStyle = nameTagSettings.qrBgColor || "#ffffff";
        ctx.fillRect(qrX - (qrSize / 2) - 5, qrY - (qrSize / 2) - 5, qrSize + 10, qrSize + 10);
        
        ctx.drawImage(qrCanvas, qrX - (qrSize / 2), qrY - (qrSize / 2), qrSize, qrSize);
        
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
