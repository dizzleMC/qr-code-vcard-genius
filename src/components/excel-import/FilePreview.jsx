
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Check } from "lucide-react";

export const FilePreview = ({ fileName, isProcessing, onProcessFile }) => {
  return (
    <div className="flex justify-between items-center p-5 bg-[#F9FAFB] rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 font-medium text-gray-900">
        <FileSpreadsheet size={18} className="text-[#ff7e0c]" />
        {fileName}
      </div>
      
      <Button
        className={`
          ${isProcessing ? 'bg-gray-200 text-gray-500' : 'bg-[#ff7e0c] hover:bg-[#e67008] text-white'}
          font-medium
        `}
        disabled={isProcessing}
        onClick={onProcessFile}
      >
        {isProcessing ? (
          <>
            <span className="animate-spin mr-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  fill="none"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
            Wird verarbeitet...
          </>
        ) : (
          <>
            <Check size={16} className="mr-1" /> 
            Importieren
          </>
        )}
      </Button>
    </div>
  );
};
