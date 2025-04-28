
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader } from "lucide-react";

export const GenerateStep = ({
  importedData,
  isGenerating,
  generationProgress,
  onGenerate,
  onReset
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-xl font-semibold mb-6">
        Schritt 3: QR-Codes generieren
      </h2>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-xl font-semibold mb-6">Zusammenfassung</h3>
        
        <ul className="list-none p-0 m-0">
          <li className="flex justify-between mb-2">
            <span>Anzahl Kontakte:</span>
            <span className="font-medium">{importedData.length}</span>
          </li>
          {/* ... Additional summary items are handled in the parent component */}
        </ul>
      </div>
      
      {isGenerating && (
        <div className="mb-6">
          <Progress value={generationProgress} className="mb-2" />
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
          disabled={isGenerating}
          className="flex-2 bg-[#ff7e0c] text-white font-medium"
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
    </div>
  );
};
