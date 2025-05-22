
import { toast } from "sonner";
import { ExcelImporter } from "@/components/ExcelImporter";

export const ImportStep = ({
  onImportSuccess
}) => {
  const handleImportSuccess = data => {
    console.log("ImportStep - Received imported data:", data);
    onImportSuccess(data);
    toast.success(`${data.length} Kontakte erfolgreich importiert!`);
  };
  
  return <div className="bg-white rounded-xl shadow-sm p-8 py-[33px] my-[33px]">
      <h2 className="text-xl font-semibold mb-6">
        Schritt 1: Excel-Datei importieren
      </h2>
      <ExcelImporter onImportSuccess={handleImportSuccess} />
    </div>;
};
