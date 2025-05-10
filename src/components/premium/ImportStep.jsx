
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
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Schritt 1: Excel-Datei importieren</h2>
      </div>
      
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-6">
        <ExcelImporter onImportSuccess={handleImportSuccess} />
      </div>
    </div>
  );
};
