
import { toast } from "sonner";
import { ExcelImporter } from "@/components/ExcelImporter";
import { PremiumCard } from "./PremiumCard";
import { Upload } from "lucide-react";

export const ImportStep = ({ onImportSuccess }) => {
  const handleImportSuccess = data => {
    console.log("ImportStep - Received imported data:", data);
    // Debug log to check if imported data has company and title fields
    data.forEach((contact, index) => {
      console.log(`Contact ${index + 1}:`, {
        name: `${contact.firstName} ${contact.lastName}`,
        title: contact.title,
        company: contact.company
      });
    });
    onImportSuccess(data);
    toast.success(`${data.length} Kontakte erfolgreich importiert!`);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <PremiumCard
        title="Excel-Datei importieren"
        description="Laden Sie Ihre Kontaktdaten hoch, um QR-Codes zu generieren"
        icon={Upload}
        className="p-8"
      >
        <ExcelImporter onImportSuccess={handleImportSuccess} />
      </PremiumCard>
    </div>
  );
};
