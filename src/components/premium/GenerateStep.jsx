
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader, ChevronLeft, Download, RefreshCcw } from "lucide-react";
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Zusammenfassung</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Anzahl Kontakte</span>
              <span className="font-medium text-gray-900">{importedData.length}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">QR-Code Größe</span>
              <span className="font-medium text-gray-900">{templateSettings.size}px</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Namensschild</span>
              <span className="font-medium text-gray-900">{templateSettings.nameTag?.enabled ? 'Aktiviert' : 'Deaktiviert'}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Aktionen</h3>
          
          <div className="space-y-4">
            <Button
              onClick={onGenerate}
              disabled={isGenerating || importedData.length === 0}
              className="w-full bg-accent hover:bg-accent/90 text-white flex items-center justify-center gap-2"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  Generiere...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Alle QR-Codes generieren & herunterladen
                </>
              )}
            </Button>
            
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full border-gray-300 flex items-center justify-center gap-2"
              size="lg"
            >
              <RefreshCcw size={16} />
              Prozess zurücksetzen
            </Button>
          </div>
        </div>
      </div>
      
      {isGenerating && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Fortschritt</h3>
          <Progress value={generationProgress} className="h-2 mb-2" />
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Loader className="animate-spin" size={16} />
            Generiere QR-Codes... {Math.round(generationProgress)}%
          </p>
        </div>
      )}
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-medium mb-6">QR-Code Vorschau</h3>
        <QRCodePreviewGrid 
          contacts={importedData} 
          templateSettings={templateSettings} 
          onGenerateSelected={onGenerateSelected} 
          isGenerating={isGenerating} 
        />
      </div>
    </div>
  );
};
