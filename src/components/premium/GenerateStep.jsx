import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader, Download, BarChart3 } from "lucide-react";
import { QRCodePreviewGrid } from "./QRCodePreviewGrid";
import { PremiumCard } from "./PremiumCard";

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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Summary Card */}
      <PremiumCard
        title="Zusammenfassung"
        description="Übersicht Ihrer importierten Kontakte"
        icon={BarChart3}
        className="p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-primary/5 rounded-lg border border-primary/10">
            <div className="text-2xl font-bold text-primary mb-1">
              {importedData.length}
            </div>
            <div className="text-sm text-muted-foreground">Kontakte</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-primary/5 rounded-lg border border-primary/10">
            <div className="text-2xl font-bold text-primary mb-1">
              {templateSettings.nameTag.enabled ? importedData.length * 2 : importedData.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {templateSettings.nameTag.enabled ? "QR-Codes + Namensschilder" : "QR-Codes"}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-primary/5 rounded-lg border border-primary/10">
            <div className="text-2xl font-bold text-primary mb-1">
              {templateSettings.size}px
            </div>
            <div className="text-sm text-muted-foreground">QR-Code Größe</div>
          </div>
        </div>
      </PremiumCard>
      
      {/* Progress Bar */}
      {isGenerating && (
        <PremiumCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Generierung läuft...
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(generationProgress)}%
              </span>
            </div>
            <Progress 
              value={generationProgress} 
              className="h-3 bg-glass-bg"
            />
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader className="animate-spin w-4 h-4" />
              Erstelle QR-Codes und bereite Download vor...
            </p>
          </div>
        </PremiumCard>
      )}
      
      {/* Preview Grid */}
      <PremiumCard
        title="QR-Code Vorschau"
        description="Überprüfen Sie Ihre QR-Codes vor dem Download"
        icon={Download}
        className="p-6"
      >
        <QRCodePreviewGrid 
          contacts={importedData} 
          templateSettings={templateSettings} 
          onGenerateSelected={onGenerateSelected} 
          isGenerating={isGenerating} 
        />
      </PremiumCard>
      
      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="px-8"
          disabled={isGenerating}
        >
          Zurücksetzen
        </Button>
        
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating || importedData.length === 0} 
          variant="premium"
          className="px-8"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Loader className="animate-spin w-4 h-4" />
              Generiere...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Alle QR-Codes generieren & herunterladen
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};