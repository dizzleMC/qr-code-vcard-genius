
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader, ChevronLeft } from "lucide-react";
import { QRCodePreviewGrid } from "./QRCodePreviewGrid";

export const GenerateStep = ({
  importedData,
  isGenerating,
  generationProgress,
  templateSettings,
  onGenerate,
  onGenerateSelected,
  onReset,
  onPreviousStep
}) => {
  return <div className="bg-white rounded-xl shadow-sm p-8 my-[32px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Schritt 3: QR-Codes generieren
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousStep}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Zurück
        </Button>
      </div>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Zusammenfassung</h3>
        
        <ul className="list-none p-0 m-0">
          <li className="flex justify-between mb-2">
            <span>Anzahl Kontakte:</span>
            <span className="font-medium">{importedData.length}</span>
          </li>
        </ul>
      </div>
      
      {isGenerating && <div className="mb-6">
          <Progress value={generationProgress} className="mb-2" />
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Loader className="animate-spin" size={16} />
            Generiere QR-Codes... {Math.round(generationProgress)}%
          </p>
        </div>}
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">QR-Code Vorschau</h3>
        <QRCodePreviewGrid contacts={importedData} templateSettings={templateSettings} onGenerateSelected={onGenerateSelected} isGenerating={isGenerating} />
      </div>
      
      <div className="flex gap-4">
        <Button onClick={onReset} variant="outline" className="flex-1">
          Zurücksetzen
        </Button>
        
        <Button onClick={onGenerate} disabled={isGenerating || importedData.length === 0} className="flex-2 bg-[#ff7e0c] text-white font-medium">
          {isGenerating ? <span className="flex items-center gap-2">
              <Loader className="animate-spin" size={16} />
              Generiere...
            </span> : "Alle QR-Codes generieren & herunterladen"}
        </Button>
      </div>
    </div>;
};
