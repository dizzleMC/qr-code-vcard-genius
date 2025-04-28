
import { toast } from "sonner";
import { ExcelImporter } from "@/components/ExcelImporter";

export const ImportStep = ({ onImportSuccess }) => {
  const handleImportSuccess = (data) => {
    onImportSuccess(data);
    toast.success(`${data.length} Kontakte erfolgreich importiert!`);
  };

  return (
    <div className="space-y-6">
      <ExcelImporter onImportSuccess={handleImportSuccess} />
    </div>
  );
};
