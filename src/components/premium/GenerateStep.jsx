
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="border border-gray-200 rounded-xl shadow-card p-8 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#1A1F2C] flex items-center">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#ff7e0c] to-[#ff9a41] text-white text-sm font-bold mr-3">3</span>
            QR-Codes generieren
          </h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPreviousStep}
            className="flex items-center gap-2 border-gray-200 hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
            Zurück
          </Button>
        </div>
        
        <div className="mb-6 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[#1A1F2C]">Zusammenfassung</h3>
          
          <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-[#64748b]">Anzahl Kontakte:</span>
              <span className="font-semibold text-[#1A1F2C]">{importedData.length}</span>
            </div>
          </div>
        </div>
        
        {isGenerating && (
          <div className="mb-6 p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
            <Progress 
              value={generationProgress} 
              className="mb-3 h-2"
              indicatorClassName="bg-gradient-to-r from-[#ff7e0c] to-[#ff9a41]"
            />
            <p className="text-sm text-[#64748b] flex items-center gap-2">
              <Loader className="animate-spin text-accent" size={16} />
              Generiere QR-Codes... {Math.round(generationProgress)}%
            </p>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-[#1A1F2C]">QR-Code Vorschau</h3>
          <QRCodePreviewGrid 
            contacts={importedData} 
            templateSettings={templateSettings} 
            onGenerateSelected={onGenerateSelected} 
            isGenerating={isGenerating}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="sm:flex-1 border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Zurücksetzen
          </Button>
          
          <Button 
            onClick={onGenerate} 
            disabled={isGenerating || importedData.length === 0} 
            className="sm:flex-grow-[3] bg-gradient-to-r from-[#ff7e0c] to-[#ff9a41] hover:from-[#e67008] hover:to-[#e68a37] text-white font-medium shadow-sm transition-transform hover:scale-[1.01]"
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
