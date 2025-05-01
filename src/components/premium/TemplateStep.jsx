
import { Button } from "@/components/ui/button";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NameTagCreator } from "./NameTagCreator";
import { ChevronLeft, CheckCircle } from "lucide-react";
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
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent text-white text-sm font-medium">2</div>
          <h2 className="text-lg font-semibold text-[#1A1F2C]">QR-Code & Namensschild anpassen</h2>
        </div>
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
      
      <div className="border border-gray-200 rounded-xl bg-white p-0 shadow-sm overflow-hidden">
        <Tabs defaultValue="qrcode" className="w-full">
          <div className="border-b border-gray-100">
            <TabsList className="w-full bg-white rounded-none h-14 px-6">
              <TabsTrigger value="qrcode" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:rounded-none">QR-Code</TabsTrigger>
              <TabsTrigger value="nametag" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:rounded-none">Namensschild</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="qrcode" className="p-6 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-lg">
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
                
                <div className="space-y-5 p-5 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-700">Größe</label>
                      <span className="text-sm text-gray-500">{templateSettings.size}px</span>
                    </div>
                    <Slider
                      defaultValue={[templateSettings.size]}
                      min={100}
                      max={400}
                      step={10}
                      onValueChange={handleSizeChange}
                      className="my-4"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">QR-Code Farbe</label>
                    <div className="grid grid-cols-5 gap-2">
                      {predefinedColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`w-full aspect-square rounded-md border transition-all ${
                            templateSettings.fgColor === color ? 'border-accent ring-1 ring-accent/20' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => onTemplateChange('fgColor', color)}
                          aria-label={`QR-Code Farbe ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Hintergrundfarbe</label>
                    <div className="grid grid-cols-5 gap-2">
                      {backgroundColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`w-full aspect-square rounded-md border transition-all ${
                            templateSettings.bgColor === color ? 'border-accent ring-1 ring-accent/20' : 'border-gray-200'
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
                    className="w-full flex items-center justify-center gap-2 mt-3 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle size={16} />
                    QR-Code Konfiguration übernehmen
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-700">Kontakte ({importedData.length})</h3>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-[460px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importedData.map((contact, index) => (
                          <TableRow 
                            key={index} 
                            className={`cursor-pointer hover:bg-gray-50 ${selectedContact === contact ? 'bg-accent/5' : ''}`}
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
                  className="w-full bg-accent hover:bg-accent/90 text-white"
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
                className="w-full bg-accent hover:bg-accent/90 text-white"
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
