
import { toast } from "sonner";
import { ExcelImporter } from "@/components/ExcelImporter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ImportStep = ({ onImportSuccess }) => {
  const handleImportSuccess = (data) => {
    onImportSuccess(data);
    toast.success(`${data.length} Kontakte erfolgreich importiert!`);
  };

  return (
    <Card className="border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white overflow-hidden">
      <CardHeader className="border-b bg-white pb-6">
        <h2 className="text-xl font-medium text-gray-900">
          Excel-Datei importieren
        </h2>
      </CardHeader>
      <CardContent className="p-8">
        <ExcelImporter onImportSuccess={handleImportSuccess} />
      </CardContent>
    </Card>
  );
};
