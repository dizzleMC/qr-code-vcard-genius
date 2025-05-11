
import { Button } from "@/components/ui/button";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NameTagCreator } from "./NameTagCreator";
import { ChevronLeft, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export const TemplateStep = ({ 
  templateData,
  templateSettings,
  importedData,
  selectedContact,
  onTemplateChange,
  onSelectContact,
  onNextStep,
  onApplyQRConfig,
  onPreviousStep
}) => {
  const handleNameTagSettingChange = (setting, value) => {
    onTemplateChange('nameTag', {
      ...templateSettings.nameTag,
      [setting]: value
    });
  };

  const predefinedColors = [
    "#ff7e0c", "#4ADE80", "#3B82F6", "#1A1F2C", "#6B7280"
  ];
  
  const backgroundColors = [
    "#FFFFFF", "#FEF9C3", "#E5DEFF", "#F5F3FF", "#E7FEE1"
  ];

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };
  
  const handleSizeChange = (value) => {
    onTemplateChange('size', value[0]);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1A1F2C] mb-1">Schritt 2: QR-Code & Namensschild anpassen</h2>
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
      
      <div className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
        <Tabs defaultValue="qrcode" className="w-full">
          <div className="border-b border-gray-100">
            <TabsList className="rounded-none px-6">
              <TabsTrigger value="qrcode">
                QR-Code
              </TabsTrigger>
              <TabsTrigger value="nametag">
                Namensschild
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="qrcode" className="p-6 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 rounded-lg bg-[#F9FAFB] border border-gray-100">
                    <QRCodeDisplay
                      data={selectedContact || templateData}
                      initialSize={templateSettings.size}
                      initialFgColor={templateSettings.fgColor}
                      initialBgColor={templateSettings.bgColor}
                      onSizeChange={(size) => onTemplateChange('size', size)}
                      onFgColorChange={(color) => onTemplateChange('fgColor', color)}
                      onBgColorChange={(color) => onTemplateChange('bgColor', color)}
                      previewMode={true}
                    />
                  </div>
                </div>
                
                <div className="space-y-5 p-5 rounded-lg bg-[#F9FAFB] border border-gray-100">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#1A1F2C]">Größe</span>
                      <span className="text-sm text-gray-500">{templateSettings.size}px</span>
                    </div>
                    <div className="px-2 py-4">
                      <Slider
                        defaultValue={[templateSettings.size]}
                        min={100}
                        max={400}
                        step={10}
                        onValueChange={handleSizeChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#1A1F2C]">Farben</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {predefinedColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`w-full aspect-square rounded-md transition-all ${
                            templateSettings.fgColor === color ? 'ring-2 ring-gray-300' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => onTemplateChange('fgColor', color)}
                          aria-label={`QR-Code Farbe ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#1A1F2C]">Hintergrund</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {backgroundColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`w-full aspect-square rounded-md border border-gray-200 transition-all ${
                            templateSettings.bgColor === color ? 'ring-2 ring-gray-300' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => onTemplateChange('bgColor', color)}
                          aria-label={`Hintergrundfarbe ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={onApplyQRConfig}
                    className="w-full flex items-center justify-center gap-2 mt-3 bg-[#4ADE80] hover:bg-[#3BC46D] text-white"
                  >
                    <Check size={16} />
                    QR-Code Konfiguration übernehmen
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-[#1A1F2C]">Importierte Daten</h3>
                  <span className="text-sm bg-[#ff7e0c]/10 text-[#ff7e0c] px-2 py-1 rounded font-medium">
                    {importedData.length} Kontakte
                  </span>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-[460px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#F9FAFB]">
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead className="font-medium">Name</TableHead>
                          <TableHead className="hidden md:table-cell font-medium">Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importedData.map((contact, index) => (
                          <TableRow 
                            key={index} 
                            className={`cursor-pointer hover:bg-gray-50 ${selectedContact === contact ? 'bg-[#ff7e0c]/5' : ''}`}
                            onClick={() => onSelectContact(contact)}
                          >
                            <TableCell>
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                {getInitials(contact.firstName, contact.lastName)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-gray-800">{contact.firstName} {contact.lastName}</p>
                                <p className="text-xs text-gray-500">{contact.title || contact.company || '-'}</p>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-gray-600 text-sm">
                              {contact.email || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <Button
                  onClick={onNextStep}
                  className="w-full bg-[#ff7e0c] hover:bg-[#e67008] text-white"
                >
                  Weiter zu Schritt 3
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="nametag" className="mt-0 p-6">
            <NameTagCreator
              data={selectedContact || templateData}
              nameTagSettings={templateSettings.nameTag}
              onSettingChange={handleNameTagSettingChange}
              qrCodeSettings={{
                fgColor: templateSettings.fgColor,
                bgColor: templateSettings.bgColor
              }}
            />
            
            <div className="mt-6">
              <Button
                onClick={onNextStep}
                className="w-full bg-[#ff7e0c] hover:bg-[#e67008] text-white"
              >
                Weiter zu Schritt 3
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
