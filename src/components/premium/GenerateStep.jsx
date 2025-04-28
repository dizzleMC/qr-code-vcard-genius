
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader } from "lucide-react";
import { QRCodePreviewGrid } from "./QRCodePreviewGrid";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const GenerateStep = ({
  importedData,
  isGenerating,
  generationProgress,
  templateSettings,
  onGenerate,
  onGenerateSelected,
  onReset
}) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">
          Schritt 3: QR-Codes generieren
        </h2>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <Card className="bg-gray-50/50">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Zusammenfassung</h3>
            
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Anzahl Kontakte:</span>
                <span className="font-medium">{importedData.length}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        {isGenerating && (
          <div className="space-y-2">
            <Progress value={generationProgress} />
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Loader className="animate-spin" size={16} />
              Generiere QR-Codes... {Math.round(generationProgress)}%
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">QR-Code Vorschau</h3>
          <QRCodePreviewGrid 
            contacts={importedData}
            templateSettings={templateSettings}
            onGenerateSelected={onGenerateSelected}
            isGenerating={isGenerating}
          />
        </div>
        
        <div className="flex gap-4">
          <Button
            onClick={onReset}
            variant="outline"
            className="flex-1"
          >
            Zurücksetzen
          </Button>
          
          <Button
            onClick={onGenerate}
            disabled={isGenerating || importedData.length === 0}
            className="flex-2 bg-[#ff7e0c] text-white font-medium hover:bg-[#ff7e0c]/90"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Loader className="animate-spin" size={16} />
                Generiere...
              </span>
            ) : (
              "Alle QR-Codes generieren & herunterladen"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
