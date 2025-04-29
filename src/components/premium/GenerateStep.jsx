
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader, ChevronLeft, RefreshCw } from "lucide-react";
import { QRCodePreviewGrid } from "./QRCodePreviewGrid";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#1A1F2C]">
            Schritt 3: QR-Codes generieren
          </h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPreviousStep}
            className="flex items-center gap-2 border-gray-200"
          >
            <ChevronLeft size={16} />
            Zurück
          </Button>
        </div>
        
        <Card className="mb-6 border-gray-100">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#1A1F2C]">Zusammenfassung</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-[#8E9196]">Anzahl Kontakte:</span>
                <span className="font-semibold text-[#1A1F2C]">{importedData.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {isGenerating && (
          <div className="mb-6 p-4 bg-[#f8fafc] rounded-lg border border-gray-100">
            <Progress 
              value={generationProgress} 
              className="mb-2 h-2"
              indicatorClassName="bg-[#ff7e0c]"
            />
            <p className="text-sm text-[#8E9196] flex items-center gap-2">
              <Loader className="animate-spin text-[#ff7e0c]" size={16} />
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
            className="sm:flex-1 border-gray-200 flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Zurücksetzen
          </Button>
          
          <Button 
            onClick={onGenerate} 
            disabled={isGenerating || importedData.length === 0} 
            className="sm:flex-grow-[3] bg-[#ff7e0c] hover:bg-[#e67008] text-white font-medium"
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
