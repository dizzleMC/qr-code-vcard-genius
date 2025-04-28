
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
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
        
        console.log("Mapped row:", mappedRow);
        return mappedRow;
      });
      
      if (mappedData.length > 0) {
        console.log("Final mapped data:", mappedData);
        onImportSuccess(mappedData);
        toast.success(`${mappedData.length} Kontakte erfolgreich importiert!`);
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
    <div>
      <div
        style={{
          border: `2px dashed ${isDragging ? '#ff7e0c' : '#e2e8f0'}`,
          borderRadius: "0.5rem",
          padding: "2rem",
          textAlign: "center",
          backgroundColor: isDragging ? "rgba(255, 126, 12, 0.05)" : "#f8fafc",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInputChange}
        />
        
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem"
        }}>
          <div style={{
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            backgroundColor: isDragging ? "rgba(255, 126, 12, 0.1)" : "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Upload size={24} color={isDragging ? "#ff7e0c" : "#8E9196"} />
          </div>
          
          <div>
            <p style={{
              fontWeight: "500",
              marginBottom: "0.5rem"
            }}>
              {fileName || "Klicken Sie hier oder ziehen Sie eine Datei hierher"}
            </p>
            <p style={{
              fontSize: "0.875rem",
              color: "#8E9196"
            }}>
              Unterstützte Dateiformate: .xlsx, .xls, .csv
            </p>
          </div>
          
          {!fileName && (
            <div className="flex gap-2">
              <Button
                style={{
                  backgroundColor: "#ff7e0c",
                  color: "white",
                  fontWeight: "500"
                }}
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
                className="flex items-center gap-1"
              >
                <FileSpreadsheet size={16} />
                Vorlage
                <Download size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {fileName && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          padding: "0.75rem",
          backgroundColor: "#f8fafc",
          borderRadius: "0.5rem"
        }}>
          <span style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: "500"
          }}>
            <Upload size={16} />
            {fileName}
          </span>
          
          <Button
            style={{
              backgroundColor: isProcessing ? "#e2e8f0" : "#ff7e0c",
              color: "white",
              fontWeight: "500",
              opacity: isProcessing ? "0.7" : "1"
            }}
            disabled={isProcessing}
            onClick={(e) => {
              e.stopPropagation();
              if (fileInputRef.current.files[0]) {
                handleFile(fileInputRef.current.files[0]);
              }
            }}
          >
            {isProcessing ? "Wird verarbeitet..." : "Importieren"}
          </Button>
        </div>
      )}
      
      <div style={{
        marginTop: "1.5rem",
        backgroundColor: "#f8fafc",
        borderRadius: "0.5rem",
        padding: "1rem"
      }}>
        <h3 style={{
          fontSize: "1rem",
          fontWeight: "600",
          marginBottom: "0.75rem"
        }}>
          Hinweise zum Import
          <Button 
            variant="link" 
            onClick={(e) => {
              e.stopPropagation();
              downloadExcelTemplate();
            }}
            className="text-orange-500 p-0 h-auto flex items-center gap-1 ml-2"
          >
            <FileSpreadsheet size={14} />
            Excel-Vorlage herunterladen
          </Button>
        </h3>
        
        <ul style={{
          paddingLeft: "1.25rem",
          marginBottom: "0",
          color: "#8E9196",
          fontSize: "0.875rem"
        }}>
          <li>Die Excel-Datei sollte eine Kopfzeile mit Spaltenbezeichnungen haben</li>
          <li>Folgende Felder werden erkannt: Vorname, Nachname, Email, Telefon, Firma, etc.</li>
          <li>Leere Zeilen oder Zeilen ohne Namen werden übersprungen</li>
          <li>Für ein optimales Ergebnis verwenden Sie die Excel-Vorlage</li>
        </ul>
      </div>
    </div>
  );
};
