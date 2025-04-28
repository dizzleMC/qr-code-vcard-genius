
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader, Download } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";

export const QRCodePreviewGrid = ({
  contacts,
  templateSettings,
  onGenerateSelected,
  isGenerating,
}) => {
  const [selectedContacts, setSelectedContacts] = useState(contacts.map((_, index) => index));
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 9;
  
  // Generate vCard data string for QR code
  const generateVCardData = (contact) => {
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
    
    return vcard;
  };

  // Calculate pagination
  const totalPages = Math.ceil(contacts.length / contactsPerPage);
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  // Handle checkbox changes
  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((_, index) => index));
    }
  };

  const toggleContactSelection = (index) => {
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="select-all"
            checked={selectedContacts.length === contacts.length}
            onCheckedChange={toggleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm text-gray-600">
            Alle auswählen ({selectedContacts.length}/{contacts.length})
          </label>
        </div>
        
        <Button
          onClick={handleGenerateSelected}
          disabled={isGenerating || selectedContacts.length === 0}
          className="bg-[#ff7e0c] text-white font-medium hover:bg-[#ff7e0c]/90"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Loader className="animate-spin" size={16} />
              Generiere...
            </span>
          ) : (
            `${selectedContacts.length} QR-Codes herunterladen`
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentContacts.map((contact, index) => {
          const actualIndex = indexOfFirstContact + index;
          return (
            <Card
              key={actualIndex}
              className={`overflow-hidden ${
                selectedContacts.includes(actualIndex) ? 'ring-2 ring-[#ff7e0c]' : ''
              }`}
            >
              <div className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id={`contact-${actualIndex}`}
                      checked={selectedContacts.includes(actualIndex)}
                      onCheckedChange={() => toggleContactSelection(index)}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      {contact.company && (
                        <p className="text-sm text-gray-500">
                          {contact.company}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="p-4 bg-gray-50 rounded-lg">
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
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    onGenerateSelected([contact]);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  QR-Code herunterladen
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
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
              
              return (
                <PaginationItem key={i}>
                  {(i === 1 && pageNumber !== 2 && totalPages > 5) || 
                   (i === 3 && pageNumber !== totalPages - 1 && totalPages > 5) ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink 
                      isActive={currentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  )}
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
