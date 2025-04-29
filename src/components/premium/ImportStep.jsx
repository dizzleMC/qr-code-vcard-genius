
import { toast } from "sonner";
import { ExcelImporter } from "@/components/ExcelImporter";
import { FileDown, FileUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ImportStep = ({
  onImportSuccess
}) => {
  const handleImportSuccess = data => {
    onImportSuccess(data);
    toast.success(`${data.length} Kontakte erfolgreich importiert!`);
  };
  
  const handleDownloadTemplate = () => {
    // Template download functionality would be here
    toast.info("Excel-Vorlage wird heruntergeladen...");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-accent/10 p-3">
            <FileUp className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Excel-Datei importieren</h3>
            <p className="text-sm text-gray-500 mt-1">
              Laden Sie eine Excel-Datei mit Ihren Kontakten hoch, um QR-Codes zu erstellen
            </p>
          </div>
          <ExcelImporter onImportSuccess={handleImportSuccess} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-blue-100 p-2">
            <FileDown className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Excel-Vorlage herunterladen</h4>
            <p className="text-sm text-gray-500 mt-1">
              Verwenden Sie unsere Vorlage für den einfachen Import Ihrer Kontaktdaten
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 gap-2"
              onClick={handleDownloadTemplate}
            >
              <Download size={16} />
              Vorlage herunterladen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
