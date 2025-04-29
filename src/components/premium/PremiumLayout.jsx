
import { Link } from "react-router-dom";
import { GuideSection } from "@/components/GuideSection";

export const PremiumLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <nav className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-md text-[#8E9196] font-medium text-sm"
            >
              Einzel QR-Code
            </Link>
            <Link
              to="/premium"
              className="px-5 py-2.5 rounded-md bg-[#ff7e0c] text-white font-medium text-sm"
            >
              Premium Bulk-Generator
            </Link>
          </div>
        </nav>
        
        <div className="max-w-[768px] mx-auto mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#1A1F2C] mb-2">
            QR-Code Bulk Generator
          </h1>
          <p className="text-[#8E9196] text-lg">
            Erstellen Sie QR-Codes für mehrere Kontakte auf einmal
          </p>
        </div>
        
        {children}
        
        <GuideSection />
      </div>
    </div>
  );
};
