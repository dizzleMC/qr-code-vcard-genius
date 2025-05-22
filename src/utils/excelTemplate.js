
import { utils, write } from 'xlsx';

export const generateExcelTemplate = () => {
  // Create a new workbook
  const wb = utils.book_new();
  
  // Define headers in German and English
  const headers = [
    "Vorname (First Name)",
    "Nachname (Last Name)",
    "Akademischer Titel (Academic Title)",
    "Titel (Title/Position)",
    "Firma (Company)",
    "Email (Email)",
    "Telefon (Phone)",
    "Website (Website)",
    "Straße (Street)",
    "Stadt (City)",
    "Bundesland (State)",
    "PLZ (Zip)",
    "Land (Country)"
  ];
  
  // Sample data - expanded with more clear examples
  const sampleData = [
    {
      "Vorname (First Name)": "Max",
      "Nachname (Last Name)": "Mustermann",
      "Akademischer Titel (Academic Title)": "Dr.",
      "Titel (Title/Position)": "Geschäftsführer",
      "Firma (Company)": "Beispiel GmbH",
      "Email (Email)": "max.mustermann@beispiel.de",
      "Telefon (Phone)": "+49 123 4567890",
      "Website (Website)": "www.beispiel.de",
      "Straße (Street)": "Musterstraße 123",
      "Stadt (City)": "Berlin",
      "Bundesland (State)": "Berlin",
      "PLZ (Zip)": "10115",
      "Land (Country)": "Deutschland"
    },
    {
      "Vorname (First Name)": "Anna",
      "Nachname (Last Name)": "Schmidt",
      "Akademischer Titel (Academic Title)": "Prof.",
      "Titel (Title/Position)": "Marketing Manager",
      "Firma (Company)": "Muster AG",
      "Email (Email)": "a.schmidt@muster-ag.de",
      "Telefon (Phone)": "+49 987 6543210",
      "Website (Website)": "www.muster-ag.de",
      "Straße (Street)": "Hauptstraße 42",
      "Stadt (City)": "München",
      "Bundesland (State)": "Bayern",
      "PLZ (Zip)": "80331",
      "Land (Country)": "Deutschland"
    }
  ];
  
  // Create worksheet with sample data
  const ws = utils.json_to_sheet(sampleData, { header: headers });
  
  // Add column widths for better readability
  const colWidths = headers.map(h => ({ wch: Math.max(20, h.length) }));
  ws['!cols'] = colWidths;
  
  // Add the worksheet to the workbook
  utils.book_append_sheet(wb, ws, "Kontakte");
  
  // Generate Excel file in binary string format
  const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' });
  
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

// Function to trigger download
export const downloadExcelTemplate = () => {
  const blob = generateExcelTemplate();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'QR-Code-Template.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
