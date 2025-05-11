
import { useState, useRef } from "react";
import { toast } from "sonner";
import { DropZone } from "./excel-import/DropZone";
import { FilePreview } from "./excel-import/FilePreview";
import { ImportInfo } from "./excel-import/ImportInfo";
import { processExcelFile } from "./excel-import/FileProcessor";

export const ExcelImporter = ({ onImportSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef(null);
  
  const handleFileSelect = (file) => {
    setFileName(file.name);
    fileRef.current = file;
  };
  
  const handleProcessFile = async () => {
    if (!fileRef.current) return;
    
    setIsProcessing(true);
    const mappedData = await processExcelFile(fileRef.current);
    setIsProcessing(false);
    
    if (mappedData) {
      onImportSuccess(mappedData);
    }
  };

  return (
    <div className="space-y-6">
      {!fileName ? (
        <DropZone onFileSelect={handleFileSelect} />
      ) : (
        <FilePreview 
          fileName={fileName}
          isProcessing={isProcessing}
          onProcessFile={handleProcessFile}
        />
      )}
      
      <ImportInfo />
    </div>
  );
};
