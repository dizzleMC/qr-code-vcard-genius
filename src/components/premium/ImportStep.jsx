
import { toast } from "sonner";
import { ExcelImporter } from "@/components/ExcelImporter";

export const ImportStep = ({
  onImportSuccess
}) => {
  const handleImportSuccess = data => {
    onImportSuccess(data);
    toast.success(`${data.length} Kontakte erfolgreich importiert!`);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-[#1A1F2C]">
        Schritt 1: Excel-Datei importieren
      </h2>
      
      <div className="border border-gray-200 rounded-lg p-8 mb-6">
        <ExcelImporter onImportSuccess={handleImportSuccess} />
      </div>
    </div>
  );
};
