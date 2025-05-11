
import { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { downloadExcelTemplate } from "@/utils/excelTemplate";
import { HelpCircle, FileSpreadsheet, Download } from "lucide-react";

export const GuideSection = () => {
  const [expandedSection, setExpandedSection] = useState("item-1");
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Anleitung: So erstellen Sie QR-Codes für mehrere Kontakte</h2>
      <p className="text-gray-600 mb-6">
        Folgen Sie dieser Schritt-für-Schritt-Anleitung, um QR-Codes für Ihre Kontakte zu erstellen.
      </p>
      
      <Accordion type="single" defaultValue="item-1" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-medium">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold">1</span>
              Einführung & Überblick
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 space-y-4">
            <p>
              Der QR-Code Bulk Generator ermöglicht es Ihnen, mehrere Kontakt-QR-Codes auf einmal zu erstellen.
              Diese QR-Codes können z.B. für Visitenkarten, Namensschilder oder Marketingmaterialien verwendet werden.
            </p>
            <p>
              Der Prozess besteht aus drei einfachen Schritten:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Importieren Sie Ihre Kontaktdaten aus einer Excel-Datei</li>
              <li>Passen Sie das Aussehen der QR-Codes an</li>
              <li>Generieren und laden Sie alle QR-Codes als ZIP-Archiv herunter</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-medium">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold">2</span>
              Vorbereitung der Excel-Datei
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 space-y-4">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
              <p className="font-semibold">Tipp: Verwenden Sie unsere Excel-Vorlage</p>
              <p className="mt-1">
                Laden Sie unsere vorgefertigte Excel-Vorlage herunter, die bereits alle benötigten Spalten enthält.
              </p>
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  onClick={downloadExcelTemplate}
                  className="flex items-center gap-2 bg-white hover:bg-orange-50"
                >
                  <FileSpreadsheet size={16} />
                  Excel-Vorlage herunterladen
                  <Download size={16} />
                </Button>
              </div>
            </div>
            
            <h4 className="font-semibold mt-4">Unterstützte Spalten:</h4>
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Spaltenname (DE)</th>
                  <th className="border p-2 text-left">Spaltenname (EN)</th>
                  <th className="border p-2 text-left">Beschreibung</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Vorname</td>
                  <td className="border p-2">First Name</td>
                  <td className="border p-2">Vorname der Kontaktperson</td>
                </tr>
                <tr>
                  <td className="border p-2">Nachname</td>
                  <td className="border p-2">Last Name</td>
                  <td className="border p-2">Nachname der Kontaktperson</td>
                </tr>
                <tr>
                  <td className="border p-2">Titel</td>
                  <td className="border p-2">Title/Position</td>
                  <td className="border p-2">Berufsbezeichnung oder Position</td>
                </tr>
                <tr>
                  <td className="border p-2">Firma</td>
                  <td className="border p-2">Company</td>
                  <td className="border p-2">Name des Unternehmens</td>
                </tr>
                <tr>
                  <td className="border p-2">Email</td>
                  <td className="border p-2">Email</td>
                  <td className="border p-2">E-Mail-Adresse</td>
                </tr>
                <tr>
                  <td className="border p-2">Telefon</td>
                  <td className="border p-2">Phone</td>
                  <td className="border p-2">Telefonnummer (inkl. Landesvorwahl)</td>
                </tr>
                <tr>
                  <td className="border p-2">Website</td>
                  <td className="border p-2">Website</td>
                  <td className="border p-2">Webseite (mit oder ohne http://)</td>
                </tr>
                <tr>
                  <td className="border p-2">Straße</td>
                  <td className="border p-2">Street</td>
                  <td className="border p-2">Straße und Hausnummer</td>
                </tr>
                <tr>
                  <td className="border p-2">Stadt</td>
                  <td className="border p-2">City</td>
                  <td className="border p-2">Stadt/Ort</td>
                </tr>
                <tr>
                  <td className="border p-2">Bundesland</td>
                  <td className="border p-2">State</td>
                  <td className="border p-2">Bundesland/Region</td>
                </tr>
                <tr>
                  <td className="border p-2">PLZ</td>
                  <td className="border p-2">Zip</td>
                  <td className="border p-2">Postleitzahl</td>
                </tr>
                <tr>
                  <td className="border p-2">Land</td>
                  <td className="border p-2">Country</td>
                  <td className="border p-2">Land</td>
                </tr>
              </tbody>
            </table>
            
            <h4 className="font-semibold mt-4">Tipps zur Datenvorbereitung:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Stellen Sie sicher, dass Ihre Excel-Datei eine Kopfzeile mit Spaltennamen enthält
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center ml-1 cursor-help text-gray-500">
                        <HelpCircle size={14} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Die erste Zeile der Excel-Datei sollte die Spaltennamen enthalten.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
              <li>Die Datei kann im .xlsx, .xls oder .csv Format vorliegen</li>
              <li>Achten Sie auf korrekte Telefonnummern mit Ländervorwahl (z.B. +49 für Deutschland)</li>
              <li>Sie können entweder die deutschen oder englischen Spaltennamen verwenden</li>
              <li>Nicht alle Felder müssen ausgefüllt sein, aber Vorname und Nachname werden empfohlen</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg font-medium">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold">3</span>
              QR-Code Styling Optionen
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 space-y-4">
            <p>
              Nachdem Sie Ihre Kontaktdaten importiert haben, können Sie das Aussehen der QR-Codes anpassen:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold mb-2">QR-Code Größe</h4>
                <p>
                  Wählen Sie die Größe der QR-Codes in Pixeln. 
                  Empfohlene Werte:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Klein (150px): Für kleine Abdrucke wie Visitenkarten</li>
                  <li>Mittel (200-250px): Für die meisten Anwendungen</li>
                  <li>Groß (300-400px): Für hochauflösende Drucke oder Poster</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold mb-2">QR-Code Farbe</h4>
                <p>
                  Passen Sie die Farbe der QR-Codes an Ihr Corporate Design an.
                  Beachten Sie:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Wählen Sie Farben mit hohem Kontrast für bessere Lesbarkeit</li>
                  <li>Dunkle Farben auf hellem Hintergrund funktionieren am besten</li>
                  <li>Zu helle QR-Codes können von manchen Scannern nicht erkannt werden</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold mb-2">Hintergrundfarbe</h4>
                <p>
                  Die Hintergrundfarbe sollte einen starken Kontrast zur QR-Code Farbe bilden.
                  Weiß oder sehr helle Farben sind am besten geeignet.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold mb-2">Vorschau</h4>
                <p>
                  Überprüfen Sie in der Vorschau, ob der QR-Code gut lesbar ist.
                  Testen Sie ihn mit Ihrer Smartphone-Kamera, um sicherzustellen, dass er funktioniert.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg font-medium">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold">4</span>
              Bulk-Generation und Download
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 space-y-4">
            <p>
              Im letzten Schritt werden alle QR-Codes generiert und als ZIP-Archiv zum Download bereitgestellt:
            </p>
            
            <h4 className="font-semibold mt-4">Vor der Generierung:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Überprüfen Sie die Anzahl der zu generierenden QR-Codes</li>
              <li>Stellen Sie sicher, dass alle Einstellungen korrekt sind</li>
              <li>Bei vielen Kontakten kann der Generierungsprozess einige Momente dauern</li>
            </ul>
            
            <h4 className="font-semibold mt-4">Dateibenennung:</h4>
            <p>
              Jeder QR-Code wird nach dem folgenden Schema benannt:
              <code className="bg-gray-100 px-2 py-1 rounded mx-1">[Vorname]-[Nachname]-qr.png</code>
            </p>
            
            <h4 className="font-semibold mt-4">Nach dem Download:</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Entpacken Sie das ZIP-Archiv auf Ihrem Computer</li>
              <li>Die PNG-Dateien können direkt für den Druck oder digitale Verwendung genutzt werden</li>
              <li>Testen Sie die QR-Codes vor der Massenproduktion</li>
            </ul>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
              <p className="font-semibold">Tipp:</p>
              <p>
                Wenn Sie viele QR-Codes generieren, empfehlen wir, einen modernen Browser zu verwenden und 
                andere Programme während der Generierung zu schließen, um die beste Performance zu erzielen.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-lg font-medium">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold">5</span>
              Häufige Fragen & Problemlösungen
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 space-y-4">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold">Welche Daten sind am wichtigsten für einen VCard QR-Code?</h4>
                <p className="mt-1">
                  Für einen effektiven VCard QR-Code sind Name, E-Mail und Telefonnummer am wichtigsten.
                  Zusätzliche Informationen wie Firma, Position und Adresse machen den Kontakt vollständiger.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Meine Excel-Datei wird nicht korrekt erkannt. Was kann ich tun?</h4>
                <p className="mt-1">
                  Stellen Sie sicher, dass:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Die Datei im .xlsx, .xls oder .csv Format vorliegt</li>
                  <li>Die erste Zeile Spaltennamen enthält</li>
                  <li>Die Spaltennamen den unterstützten Namen ähnlich sind</li>
                  <li>Die Datei keine speziellen Formatierungen oder Makros enthält</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold">Wie kann ich testen, ob die QR-Codes funktionieren?</h4>
                <p className="mt-1">
                  Verwenden Sie die Kamera-App Ihres Smartphones, um den QR-Code zu scannen. 
                  Bei erfolgreicher Erkennung sollten Sie die Option erhalten, den Kontakt zu speichern.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">In welcher Auflösung werden die QR-Codes generiert?</h4>
                <p className="mt-1">
                  Die QR-Codes werden in der exakten Pixelgröße generiert, die Sie im Template-Bereich festlegen.
                  Für hochwertige Drucke empfehlen wir mindestens 300px.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Werden meine Daten gespeichert?</h4>
                <p className="mt-1">
                  Nein, Ihre Daten werden nur temporär im Browser verarbeitet und nicht auf einem Server gespeichert.
                  Nach dem Schließen der Seite werden alle Daten gelöscht.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Kann ich die generierten QR-Codes später anpassen?</h4>
                <p className="mt-1">
                  Um Änderungen vorzunehmen, müssen Sie den Generierungsprozess mit den gewünschten Anpassungen wiederholen.
                  Speichern Sie Ihre Excel-Datei, damit Sie sie leicht erneut importieren können.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
