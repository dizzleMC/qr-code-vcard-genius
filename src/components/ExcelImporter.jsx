
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload } from "lucide-react";

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
      
      // Map the Excel data to our expected format
      const mappedData = jsonData.map(row => {
        // Try to match common field names in Excel files
        return {
          firstName: row.firstName || row.Vorname || row['First Name'] || row.Name || '',
          lastName: row.lastName || row.Nachname || row['Last Name'] || row.Familienname || '',
          title: row.title || row.Titel || row.Position || row.JobTitle || '',
          company: row.company || row.Firma || row.Unternehmen || row.Company || '',
          email: row.email || row.Email || row['E-Mail'] || '',
          phone: row.phone || row.Telefon || row.Phone || row.Tel || row.Mobil || '',
          website: row.website || row.Website || row.Webseite || row.URL || '',
          street: row.street || row.Straße || row.Strasse || row.Street || row.Adresse || '',
          city: row.city || row.Stadt || row.City || row.Ort || '',
          state: row.state || row.Bundesland || row.State || row.Region || row.Land || '',
          zip: row.zip || row.PLZ || row['Postal Code'] || row.Postleitzahl || '',
          country: row.country || row.Land || row.Country || row.Nation || ''
        };
      });
      
      if (mappedData.length === 0) {
        toast.error("Die Datei enthält keine gültigen Daten.");
        return;
      }
      
      onImportSuccess(mappedData);
      
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
        }}>Hinweise zum Import</h3>
        
        <ul style={{
          paddingLeft: "1.25rem",
          marginBottom: "0",
          color: "#8E9196",
          fontSize: "0.875rem"
        }}>
          <li>Die Excel-Datei sollte eine Kopfzeile mit Spaltenbezeichnungen haben</li>
          <li>Folgende Felder werden erkannt: Vorname, Nachname, Email, Telefon, Firma, etc.</li>
          <li>Leere Zeilen oder Zeilen ohne Namen werden übersprungen</li>
        </ul>
      </div>
    </div>
  );
};
