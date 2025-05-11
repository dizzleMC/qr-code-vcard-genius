
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader, ChevronLeft, RefreshCw } from "lucide-react";
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
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1A1F2C] mb-1">Schritt 3: QR-Codes generieren</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousStep}
          className="flex items-center gap-2 border-gray-200 text-gray-600"
        >
          <ChevronLeft size={16} />
          Zurück
        </Button>
      </div>
      
      <div className="border border-gray-100 rounded-xl bg-white p-6 shadow-sm space-y-6">
        <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-base font-medium mb-3 text-[#1A1F2C]">Zusammenfassung</h3>
          
          <div className="flex justify-between items-center py-3 px-4 bg-white rounded-md border border-gray-100">
            <span className="text-sm text-gray-600">Anzahl Kontakte:</span>
            <span className="font-medium text-[#1A1F2C]">{importedData.length}</span>
          </div>
        </div>
        
        {isGenerating && (
          <div className="p-5 bg-gray-50 border border-gray-100 rounded-lg">
            <Progress 
              value={generationProgress} 
              className="h-1.5 mb-3 bg-gray-200 [&>div]:bg-[#ff7e0c]"
            />
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Loader className="animate-spin text-[#ff7e0c]" size={14} />
              Generiere QR-Codes... {Math.round(generationProgress)}%
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <h3 className="text-base font-medium text-[#1A1F2C]">QR-Code Vorschau</h3>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <QRCodePreviewGrid 
              contacts={importedData} 
              templateSettings={templateSettings} 
              onGenerateSelected={onGenerateSelected} 
              isGenerating={isGenerating}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="sm:flex-1 border-gray-200 flex items-center justify-center gap-2 py-2.5"
          >
            <RefreshCw size={16} />
            Zurücksetzen
          </Button>
          
          <Button 
            onClick={onGenerate} 
            disabled={isGenerating || importedData.length === 0} 
            className="sm:flex-grow-[3] bg-[#ff7e0c] hover:bg-[#e67008] text-white font-medium py-2.5"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Loader className="animate-spin" size={16} />
                Generiere...
              </span>
            ) : "Alle QR-Codes generieren & herunterladen"}
          </Button>
        </div>
      </div>
    </div>
  );
};
