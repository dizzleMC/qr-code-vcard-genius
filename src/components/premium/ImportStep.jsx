
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
      <h2 className="text-xl font-semibold mb-6 text-[#1A1F2C] flex items-center">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#ff7e0c] to-[#ff9a41] text-white text-sm font-bold mr-3">1</span>
        Excel-Datei importieren
      </h2>
      
      <div className="border border-gray-200 rounded-xl shadow-card bg-white p-8 mb-6">
        <ExcelImporter onImportSuccess={handleImportSuccess} />
      </div>
    </div>
  );
};
