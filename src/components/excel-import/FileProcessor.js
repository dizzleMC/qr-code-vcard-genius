
import { toast } from "sonner";

export const processExcelFile = async (file) => {
  const fileExtension = file.name.split('.').pop().toLowerCase();
  
  if (!['xlsx', 'xls', 'csv'].includes(fileExtension)) {
    toast.error("Bitte laden Sie eine Excel- oder CSV-Datei hoch.");
    return null;
  }
  
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
      return null;
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
      return mappedData;
    } else {
      toast.error("Die Datei enthält keine gültigen Daten.");
      return null;
    }
    
  } catch (error) {
    console.error("Error processing Excel file:", error);
    toast.error("Fehler beim Verarbeiten der Datei. Bitte stellen Sie sicher, dass es sich um eine gültige Excel- oder CSV-Datei handelt.");
    return null;
  }
};
