
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { downloadExcelTemplate } from "@/utils/excelTemplate";

export const ImportInfo = () => {
  return (
    <div className="p-6 bg-[#F9FAFB] border border-gray-200 rounded-xl">
      <h3 className="text-base font-semibold mb-4 text-gray-900">
        Hinweise zum Import
      </h3>
      
      <div className="flex items-start mb-4">
        <Button 
          variant="link" 
          onClick={(e) => {
            e.stopPropagation();
            downloadExcelTemplate();
          }}
          className="text-[#ff7e0c] p-0 h-auto flex items-center gap-1 hover:text-[#e67008]"
        >
          <FileSpreadsheet size={14} />
          Excel-Vorlage herunterladen
        </Button>
      </div>
      
      <div className="space-y-3 text-sm text-slate-600">
        <p className="flex items-start gap-2">
          <span className="min-w-[6px] h-[6px] rounded-full bg-[#ff7e0c] inline-block mt-[0.4rem]"></span>
          <span>Die Excel-Datei sollte eine Kopfzeile mit Spaltenbezeichnungen haben</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="min-w-[6px] h-[6px] rounded-full bg-[#ff7e0c] inline-block mt-[0.4rem]"></span>
          <span>Folgende Felder werden erkannt: Vorname, Nachname, Email, Telefon, Firma, etc.</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="min-w-[6px] h-[6px] rounded-full bg-[#ff7e0c] inline-block mt-[0.4rem]"></span>
          <span>Leere Zeilen oder Zeilen ohne Namen werden übersprungen</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="min-w-[6px] h-[6px] rounded-full bg-[#ff7e0c] inline-block mt-[0.4rem]"></span>
          <span>Für ein optimales Ergebnis verwenden Sie die Excel-Vorlage</span>
        </p>
      </div>
    </div>
  );
};
