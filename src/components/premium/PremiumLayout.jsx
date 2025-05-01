
import { Link } from "react-router-dom";
import { GuideSection } from "@/components/GuideSection";

export const PremiumLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex justify-center mb-10">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            <Link
              to="/"
              className="px-5 py-2 rounded-md text-[#64748b] font-medium text-sm transition-all hover:text-gray-700"
            >
              Einzel QR-Code
            </Link>
            <Link
              to="/premium"
              className="px-5 py-2 rounded-md bg-accent text-white font-medium text-sm shadow-sm transition-transform hover:scale-[1.02]"
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
