
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
    <div className="bg-white rounded-xl shadow-sm p-8 my-6">
      <h2 className="text-xl font-semibold mb-6 text-[#1A1F2C]">
        Schritt 1: Excel-Datei importieren
      </h2>
      <ExcelImporter onImportSuccess={handleImportSuccess} />
    </div>
  );
};
