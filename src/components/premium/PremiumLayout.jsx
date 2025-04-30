
import { Link } from "react-router-dom";
import { GuideSection } from "@/components/GuideSection";

export const PremiumLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <nav className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-md p-1 inline-flex">
            <Link
              to="/"
              className="px-6 py-2.5 rounded-lg text-[#8E9196] font-medium text-sm transition-all hover:text-gray-700"
            >
              Einzel QR-Code
            </Link>
            <Link
              to="/premium"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#ff7e0c] to-[#ff9a41] text-white font-medium text-sm shadow-sm transition-transform hover:scale-[1.02]"
            >
              Premium Bulk-Generator
            </Link>
          </div>
        </nav>
        
        {children}
        
        <GuideSection />
      </div>
    </div>
  );
};
