
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadExcelTemplate } from "@/utils/excelTemplate";

export const DropZone = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };
  
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
        ${isDragging ? 'border-[#ff7e0c] bg-[#FFF7ED]' : 'border-gray-200 bg-white'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileInputChange}
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-[#FFF7ED] flex items-center justify-center">
          <Upload size={32} className="text-[#ff7e0c]" />
        </div>
        
        <div>
          <p className="font-medium text-gray-900 text-xl mb-1">
            Klicken Sie hier oder ziehen Sie eine Datei hierher
          </p>
          <p className="text-sm text-slate-600">
            Unterstützte Dateiformate: .xlsx, .xls, .csv
          </p>
        </div>
        
        <div className="flex gap-3 mt-2">
          <Button
            className="bg-[#ff7e0c] hover:bg-[#e67008] text-white font-medium py-2.5"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current.click();
            }}
          >
            Datei auswählen
          </Button>
          
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              downloadExcelTemplate();
            }}
            className="flex items-center gap-1 border-gray-200 hover:bg-gray-50 text-slate-600"
          >
            <Download size={16} className="mr-1" />
            Vorlage
          </Button>
        </div>
      </div>
    </div>
  );
};
