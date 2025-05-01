
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
      <div className="flex items-center mb-6 space-x-3">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent text-white text-sm font-medium">1</div>
        <h2 className="text-lg font-semibold text-[#1A1F2C]">Excel-Datei importieren</h2>
      </div>
      
      <div className="border border-gray-200 rounded-xl bg-white p-8 mb-6 shadow-sm">
        <ExcelImporter onImportSuccess={handleImportSuccess} />
      </div>
    </div>
  );
};
