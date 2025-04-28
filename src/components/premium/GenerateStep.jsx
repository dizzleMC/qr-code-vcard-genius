
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
    <Card className="border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white h-full">
      <CardHeader className="border-b bg-white pb-6">
        <h2 className="text-xl font-medium text-gray-900">
          QR-Codes generieren
        </h2>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Zusammenfassung</h3>
          <p className="text-sm text-gray-600">
            {importedData.length} Kontakte zum Generieren
          </p>
        </div>
        
        {isGenerating && (
          <div className="space-y-3">
            <Progress value={generationProgress} className="h-2" />
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Loader className="animate-spin" size={16} />
              Generiere QR-Codes... {Math.round(generationProgress)}%
            </p>
          </div>
        )}
        
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
            className="flex-1 bg-[#ff7e0c] text-white font-medium hover:bg-[#ff7e0c]/90"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Loader className="animate-spin" size={16} />
                Generiere...
              </span>
            ) : (
              "Alle QR-Codes generieren"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
