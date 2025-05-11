
import { toast } from "sonner";
import { ExcelImporter } from "@/components/ExcelImporter";
import { downloadExcelTemplate } from "@/utils/excelTemplate";
import { Button } from "@/components/ui/button";
import { FileDown, Upload } from "lucide-react";

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
        <h2 className="text-xl font-semibold text-[#1A1F2C] mb-4">Schritt 1: Excel-Datei importieren</h2>
      </div>
      
      <div className="border border-gray-100 rounded-xl bg-white shadow-sm p-8 mb-6">
        <div className="flex justify-center">
          <ExcelImporter onImportSuccess={handleImportSuccess} />
        </div>
        
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="font-medium text-[#1A1F2C] mb-3">Hinweise zum Import</h3>
          <ul className="space-y-2 text-gray-600 text-sm mb-4">
            <li>• Die Excel-Datei sollte eine Kopfzeile mit Spaltenbezeichnungen haben</li>
            <li>• Folgende Felder werden erkannt: Vorname, Nachname, Email, Telefon, Firma, etc.</li>
            <li>• Leere Zeilen oder Zeilen ohne Namen werden übersprungen</li>
            <li>• Für ein optimales Ergebnis verwenden Sie die Excel-Vorlage</li>
          </ul>
          
          <Button 
            onClick={downloadExcelTemplate}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 text-gray-700 mt-2"
          >
            <FileDown size={16} />
            Excel-Vorlage herunterladen
          </Button>
        </div>
      </div>
    </div>
  );
};
