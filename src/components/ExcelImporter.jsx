
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Download, FileSpreadsheet, Check } from "lucide-react";
import { downloadExcelTemplate } from "@/utils/excelTemplate";

export const ExcelImporter = ({ onImportSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };
  
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };
  
  const handleFile = async (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    setFileName(file.name);
    
    if (!['xlsx', 'xls', 'csv'].includes(fileExtension)) {
      toast.error("Bitte laden Sie eine Excel- oder CSV-Datei hoch.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Dynamically import Excel libraries to reduce initial bundle size
      const { read, utils } = await import('xlsx');
      
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);
      
      console.log("Imported Excel Data:", jsonData);
      
      if (jsonData.length === 0) {
        toast.error("Die Datei enthält keine gültigen Daten.");
        setIsProcessing(false);
        return;
      }
      
      // Improved column mapping with more flexible field name detection
      const mappedData = jsonData.map(row => {
        // Create an array of all possible field names for each data type
        const fieldMappings = {
          firstName: ["Vorname", "First Name", "FirstName", "Vorname (First Name)", "Name", "Given Name"],
          lastName: ["Nachname", "Last Name", "LastName", "Nachname (Last Name)", "Familienname", "Surname"],
          title: ["Titel", "Title", "Position", "Titel (Title/Position)", "JobTitle", "Rolle", "Role"],
          company: ["Firma", "Company", "Unternehmen", "Firma (Company)", "Organisation", "Organization"],
          email: ["Email", "E-Mail", "EmailAddress", "Email (Email)", "Mail"],
          phone: ["Telefon", "Phone", "Tel", "Telefonnummer", "Telefon (Phone)", "Mobile", "Mobil"],
          website: ["Website", "Webseite", "URL", "Website (Website)", "Homepage", "Web"],
          street: ["Straße", "Street", "Adresse", "Straße (Street)", "Strasse", "Address"],
          city: ["Stadt", "City", "Ort", "Stadt (City)"],
          state: ["Bundesland", "State", "Region", "Bundesland (State)", "Province"],
          zip: ["PLZ", "Zip", "Postal Code", "PLZ (Zip)", "Postleitzahl", "ZIP Code"],
          country: ["Land", "Country", "Nation", "Land (Country)"]
        };
        
        // Function to find a value in the row using any of the possible field names
        const findValue = (fieldNames) => {
          // First try exact match
          const exactMatch = fieldNames.find(name => row[name] !== undefined);
          if (exactMatch) return row[exactMatch];
          
          // Try case-insensitive match if exact match fails
          const rowKeys = Object.keys(row);
          for (const fieldName of fieldNames) {
            const matchKey = rowKeys.find(key => 
              key.toLowerCase() === fieldName.toLowerCase()
            );
            if (matchKey) return row[matchKey];
          }
          
          return ''; // Return empty string if no match found
        };
        
        // Map each field using the findValue function
        const mappedRow = {};
        for (const [key, fieldNames] of Object.entries(fieldMappings)) {
          mappedRow[key] = findValue(fieldNames);
        }
        
        return mappedRow;
      });
      
      if (mappedData.length > 0) {
        onImportSuccess(mappedData);
      } else {
        toast.error("Die Datei enthält keine gültigen Daten.");
      }
      
    } catch (error) {
      console.error("Error processing Excel file:", error);
      toast.error("Fehler beim Verarbeiten der Datei. Bitte stellen Sie sicher, dass es sich um eine gültige Excel- oder CSV-Datei handelt.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`
          border-2 border-dashed rounded-xl p-10 text-center transition-all
          ${isDragging ? 'border-accent bg-accent-light' : 'border-gray-200 bg-gradient-to-b from-white to-gray-50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInputChange}
        />
        
        <div className="flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#ff7e0c]/10 to-[#ff9a41]/10 flex items-center justify-center">
            <Upload size={32} className="text-accent" />
          </div>
          
          <div>
            <p className="font-medium text-[#1A1F2C] text-lg mb-1">
              {fileName || "Klicken oder ziehen Sie Ihre Excel-Datei hierher"}
            </p>
            <p className="text-sm text-[#64748b]">
              Unterstützte Dateiformate: .xlsx, .xls, .csv
            </p>
          </div>
          
          {!fileName && (
            <div className="flex gap-3 mt-2">
              <Button
                className="bg-gradient-to-r from-[#ff7e0c] to-[#ff9a41] hover:from-[#e67008] hover:to-[#e68a37] text-white font-medium shadow-sm transition-transform hover:scale-[1.02]"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current.click();
                }}
              >
                Datei auswählen
              </Button>
              
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadExcelTemplate();
                }}
                className="flex items-center gap-1 border-gray-200 hover:bg-gray-50"
              >
                <Download size={16} className="mr-1" />
                Vorlage
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {fileName && (
        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 font-medium text-[#1A1F2C]">
            <FileSpreadsheet size={18} className="text-accent" />
            {fileName}
          </div>
          
          <Button
            className={`
              ${isProcessing ? 'bg-gray-200 text-gray-500' : 'bg-gradient-to-r from-[#ff7e0c] to-[#ff9a41] hover:from-[#e67008] hover:to-[#e68a37] text-white shadow-sm transition-transform hover:scale-[1.02]'}
              font-medium
            `}
            disabled={isProcessing}
            onClick={(e) => {
              e.stopPropagation();
              if (fileInputRef.current.files[0]) {
                handleFile(fileInputRef.current.files[0]);
              }
            }}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin mr-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </span>
                Wird verarbeitet...
              </>
            ) : (
              <>
                <Check size={16} className="mr-1" /> 
                Importieren
              </>
            )}
          </Button>
        </div>
      )}
      
      <div className="p-6 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl shadow-sm">
        <h3 className="text-base font-semibold mb-4 text-[#1A1F2C]">
          Hinweise zum Import
        </h3>
        
        <div className="flex items-start mb-4">
          <Button 
            variant="link" 
            onClick={(e) => {
              e.stopPropagation();
              downloadExcelTemplate();
            }}
            className="text-accent p-0 h-auto flex items-center gap-1 hover:text-[#e67008]"
          >
            <FileSpreadsheet size={14} />
            Excel-Vorlage herunterladen
          </Button>
        </div>
        
        <div className="space-y-3 text-sm text-[#64748b]">
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"></span>
            Die Excel-Datei sollte eine Kopfzeile mit Spaltenbezeichnungen haben
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"></span>
            Folgende Felder werden erkannt: Vorname, Nachname, Email, Telefon, Firma, etc.
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"></span>
            Leere Zeilen oder Zeilen ohne Namen werden übersprungen
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"></span>
            Für ein optimales Ergebnis verwenden Sie die Excel-Vorlage
          </p>
        </div>
      </div>
    </div>
  );
};
