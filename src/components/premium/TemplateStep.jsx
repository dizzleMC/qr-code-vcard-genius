
import { Button } from "@/components/ui/button";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NameTagCreator } from "./NameTagCreator";
import { Save, ChevronLeft, CheckCircle, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
    "#000000", "#1A1F2C", "#3B82F6", "#10B981", "#F97316", 
    "#8B5CF6", "#EC4899", "#EF4444", "#6B7280", "#94A3B8"
  ];
  
  const backgroundColors = [
    "#FFFFFF", "#F8F9FA", "#F3F4F6", "#E5E7EB", "#F0FDF4", 
    "#EFF6FF", "#FEF3F2", "#F5F3FF", "#FDF2F8", "#FEF9C3"
  ];

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };
  
  const handleSizeChange = (value) => {
    onTemplateChange('size', value[0]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 bg-white rounded-xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#ff7e0c] to-[#ff9a41] text-white text-sm font-bold">2</span>
            QR-Code & Namensschild anpassen
          </h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPreviousStep}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Zurück
          </Button>
        </div>
        
        <Tabs defaultValue="qrcode" className="mb-6">
          <TabsList className="w-full mb-6 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="qrcode" className="w-1/2 rounded-md">QR-Code</TabsTrigger>
            <TabsTrigger value="nametag" className="w-1/2 rounded-md">Namensschild</TabsTrigger>
          </TabsList>
          
          <TabsContent value="qrcode">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="flex justify-center">
                  <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <QRCodeDisplay
                      data={selectedContact || templateData}
                      initialSize={templateSettings.size}
                      initialFgColor={templateSettings.fgColor}
                      initialBgColor={templateSettings.bgColor}
                      onSizeChange={(size) => onTemplateChange('size', size)}
                      onFgColorChange={(color) => onTemplateChange('fgColor', color)}
                      onBgColorChange={(color) => onTemplateChange('bgColor', color)}
                      showControls={false}
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-700">Größe ({templateSettings.size}px)</label>
                      <span className="text-sm text-gray-500">{templateSettings.size}px</span>
                    </div>
                    <Slider
                      defaultValue={[templateSettings.size]}
                      min={100}
                      max={400}
                      step={10}
                      onValueChange={handleSizeChange}
                      className="accent-[#ff7e0c]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">QR-Code Farbe</label>
                    <div className="grid grid-cols-5 gap-2">
                      {predefinedColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`w-full aspect-square rounded-lg border-2 transition-all ${
                            templateSettings.fgColor === color ? 'border-[#ff7e0c] ring-2 ring-orange-200' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => onTemplateChange('fgColor', color)}
                          aria-label={`QR-Code Farbe ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Hintergrundfarbe</label>
                    <div className="grid grid-cols-5 gap-2">
                      {backgroundColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`w-full aspect-square rounded-lg border-2 transition-all ${
                            templateSettings.bgColor === color ? 'border-[#ff7e0c] ring-2 ring-orange-200' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => onTemplateChange('bgColor', color)}
                          aria-label={`Hintergrundfarbe ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={onApplyQRConfig}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save size={16} />
                  QR-Code Konfiguration übernehmen
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Kontakte ({importedData.length})</h3>
                  <Button variant="outline" size="sm" onClick={onNextStep}>
                    Weiter
                  </Button>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-[500px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]"></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead className="hidden md:table-cell w-[120px]">Team</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importedData.map((contact, index) => (
                          <TableRow 
                            key={index} 
                            className={`cursor-pointer hover:bg-gray-50 ${selectedContact === contact ? 'bg-orange-50' : ''}`}
                            onClick={() => onSelectContact(contact)}
                          >
                            <TableCell>
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                {getInitials(contact.firstName, contact.lastName)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                                <p className="text-xs text-gray-500">{contact.title || 'Keine Rolle'}</p>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-gray-600">
                              {contact.email || '-'}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {contact.team ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {contact.team}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  Kein Team
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="nametag">
            <NameTagCreator
              data={selectedContact || templateData}
              nameTagSettings={templateSettings.nameTag || {
                enabled: false,
                template: "classic",
                size: "medium",
                font: "Inter",
                fontSize: 22,
                nameColor: "#1A1F2C",
                companyColor: "#8E9196",
                logo: null,
                logoScale: 100,
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                qrFgColor: "#000000",
                qrBgColor: "#ffffff"
              }}
              onSettingChange={handleNameTagSettingChange}
              qrCodeSettings={{
                fgColor: templateSettings.fgColor,
                bgColor: templateSettings.bgColor
              }}
            />
          </TabsContent>
        </Tabs>
        
        <Button
          onClick={onNextStep}
          className="mt-6 w-full bg-[#ff7e0c] text-white font-medium"
        >
          Weiter zu Schritt 3
        </Button>
      </div>
    </div>
  );
};
