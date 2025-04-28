import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { ExcelImporter } from "@/components/ExcelImporter";
import { Upload } from "lucide-react";
import { GuideSection } from "@/components/GuideSection";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ContactPreview } from "@/components/ContactPreview";
import { Loader } from "lucide-react";

const Premium = () => {
  const [templateSettings, setTemplateSettings] = useState({
    size: 200,
    fgColor: "#1A1F2C",
    bgColor: "#ffffff"
  });
  
  const [importedData, setImportedData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  const [templateData, setTemplateData] = useState({
    firstName: "Max",
    lastName: "Mustermann",
    title: "CEO",
    company: "Example GmbH",
    email: "example@mail.com",
    phone: "+49123456789",
    website: "www.example.com",
    street: "Musterstraße 123",
    city: "Musterstadt",
    state: "Bayern",
    zip: "80000",
    country: "Deutschland",
  });
  
  const handleTemplateChange = (setting, value) => {
    setTemplateSettings({
      ...templateSettings,
      [setting]: value
    });
  };
  
  const handleImportSuccess = (data) => {
    setImportedData(data);
    toast.success(`${data.length} Kontakte erfolgreich importiert!`);
    setCurrentStep(2);
  };
  
  const handleBulkGenerate = async () => {
    if (importedData.length === 0) {
      toast.error("Keine Daten zum Generieren vorhanden.");
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const worker = new Worker(new URL('../workers/qrWorker.js', import.meta.url), { type: 'module' });
      
      let completedTasks = 0;
      
      worker.onmessage = async (e) => {
        const { success, fileName, blob, progress, error } = e.data;
        
        if (success) {
          zip.file(fileName, blob);
        } else {
          console.error(`Error generating QR code: ${error}`);
        }
        
        setGenerationProgress(progress);
        completedTasks++;
        
        if (completedTasks === importedData.length) {
          const content = await zip.generateAsync({ type: "blob" });
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(content);
          downloadLink.download = "qr-codes.zip";
          downloadLink.click();
          
          worker.terminate();
          setIsGenerating(false);
          toast.success("QR-Codes wurden erfolgreich generiert und heruntergeladen!");
          setCurrentStep(3);
        }
      };
      
      const batchSize = 5;
      for (let i = 0; i < importedData.length; i += batchSize) {
        const batch = importedData.slice(i, i + batchSize);
        batch.forEach((contact, batchIndex) => {
          worker.postMessage({
            contact,
            settings: templateSettings,
            index: i + batchIndex,
            total: importedData.length
          });
        });
        
        if (i + batchSize < importedData.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error("Fehler beim Generieren der QR-Codes:", error);
      toast.error("Fehler beim Generieren der QR-Codes. Bitte versuchen Sie es erneut.");
      setIsGenerating(false);
    }
  };
  
  const resetProcess = () => {
    setImportedData([]);
    setCurrentStep(1);
    toast.info("Prozess zurückgesetzt. Sie können neue Kontakte importieren.");
  };
  
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, rgba(255, 126, 12, 0.1), white)"
    }}>
      <div style={{
        padding: "3rem 1rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <nav style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem"
        }}>
          <ul style={{
            display: "flex",
            gap: "2rem",
            listStyle: "none",
            padding: 0
          }}>
            <li>
              <Link to="/" style={{
                fontWeight: "500",
                color: "#8E9196",
                textDecoration: "none"
              }}>
                Einzel QR-Code
              </Link>
            </li>
            <li>
              <Link to="/premium" style={{
                fontWeight: "600",
                color: "#ff7e0c",
                textDecoration: "none",
                borderBottom: "2px solid #ff7e0c",
                paddingBottom: "0.25rem"
              }}>
                Premium Bulk-Generator
              </Link>
            </li>
          </ul>
        </nav>
        
        <div style={{
          maxWidth: "768px",
          margin: "0 auto",
          textAlign: "center",
          marginBottom: "3rem"
        }}>
          <h1 style={{
            fontSize: "2.25rem",
            fontWeight: "600",
            color: "#1A1F2C",
            marginBottom: "0.75rem"
          }}>QR-Code Bulk Generator</h1>
          <p style={{
            color: "#8E9196",
            fontSize: "1.125rem"
          }}>
            Erstellen Sie QR-Codes für mehrere Kontakte auf einmal
          </p>
        </div>
        
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "600px",
            margin: "0 auto 2rem auto"
          }}>
            {[1, 2, 3].map((step) => (
              <div key={step} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <div style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  backgroundColor: currentStep >= step ? "#ff7e0c" : "#e2e8f0",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  marginBottom: "0.5rem"
                }}>
                  {step}
                </div>
                <span style={{ color: currentStep >= step ? "#1A1F2C" : "#8E9196" }}>
                  {step === 1 && "Daten importieren"}
                  {step === 2 && "Template anpassen"}
                  {step === 3 && "QR-Codes generieren"}
                </span>
              </div>
            ))}
          </div>
          
          {currentStep === 1 && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              padding: "2rem"
            }}>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "1.5rem"
              }}>Schritt 1: Excel-Datei importieren</h2>
              
              <ExcelImporter onImportSuccess={handleImportSuccess} />
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-xl font-semibold mb-6">Schritt 2: QR-Code Template anpassen</h2>
                
                <QRCodeDisplay
                  data={selectedContact || templateData}
                  initialSize={templateSettings.size}
                  initialFgColor={templateSettings.fgColor}
                  initialBgColor={templateSettings.bgColor}
                  onSizeChange={(size) => handleTemplateChange('size', size)}
                  onFgColorChange={(color) => handleTemplateChange('fgColor', color)}
                  onBgColorChange={(color) => handleTemplateChange('bgColor', color)}
                />
                
                <ContactPreview
                  contacts={importedData}
                  selectedContact={selectedContact}
                  onSelectContact={setSelectedContact}
                />
                
                <Button
                  onClick={() => setCurrentStep(3)}
                  className="mt-6 w-full bg-[#ff7e0c] text-white font-medium"
                >
                  Weiter zu Schritt 3
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">Schritt 3: QR-Codes generieren</h2>
              
              <div className="flex-1 bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-semibold mb-6">Zusammenfassung</h3>
                
                <ul className="list-none p-0 m-0">
                  <li className="flex justify-between mb-2">
                    <span>Anzahl Kontakte:</span>
                    <span className="font-medium">{importedData.length}</span>
                  </li>
                  <li className="flex justify-between mb-2">
                    <span>QR-Code Größe:</span>
                    <span className="font-medium">{templateSettings.size}px</span>
                  </li>
                  <li className="flex justify-between mb-2">
                    <span>QR-Code Farbe:</span>
                    <span className="font-medium flex items-center">
                      <div style={{ 
                        width: "1rem", 
                        height: "1rem", 
                        backgroundColor: templateSettings.fgColor, 
                        display: "inline-block",
                        marginRight: "0.5rem",
                        border: "1px solid #e2e8f0"
                      }}></div>
                      {templateSettings.fgColor}
                    </span>
                  </li>
                  <li className="flex justify-between mb-2">
                    <span>Hintergrundfarbe:</span>
                    <span className="font-medium flex items-center">
                      <div style={{ 
                        width: "1rem", 
                        height: "1rem", 
                        backgroundColor: templateSettings.bgColor, 
                        display: "inline-block",
                        marginRight: "0.5rem",
                        border: "1px solid #e2e8f0"
                      }}></div>
                      {templateSettings.bgColor}
                    </span>
                  </li>
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
                  onClick={resetProcess}
                  variant="outline"
                  className="flex-1"
                >
                  Zurücksetzen
                </Button>
                
                <Button
                  onClick={handleBulkGenerate}
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
          )}
        </div>
        
        <GuideSection />
      </div>
    </div>
  );
};

export default Premium;
