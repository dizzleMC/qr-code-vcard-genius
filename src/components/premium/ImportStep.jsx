
import { toast } from "sonner";
import { ExcelImporter } from "@/components/ExcelImporter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ImportStep = ({ onImportSuccess }) => {
  const handleImportSuccess = (data) => {
    onImportSuccess(data);
    toast.success(`${data.length} Kontakte erfolgreich importiert!`);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="border-b bg-white pb-6">
        <h2 className="text-xl font-medium text-gray-900">
          Schritt 1: Excel-Datei importieren
        </h2>
      </CardHeader>
      <CardContent className="p-8 bg-[#FCFCFD]">
        <ExcelImporter onImportSuccess={handleImportSuccess} />
      </CardContent>
    </Card>
  );
};
