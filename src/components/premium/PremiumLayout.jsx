
import { Link } from "react-router-dom";
import { GuideSection } from "@/components/GuideSection";

export const PremiumLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff7e0c]/5 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-8">
          <ul className="flex justify-center gap-8">
            <li>
              <Link 
                to="/"
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Einzel QR-Code
              </Link>
            </li>
            <li>
              <Link 
                to="/premium"
                className="text-[#ff7e0c] font-semibold border-b-2 border-[#ff7e0c] pb-1"
              >
                Premium Bulk-Generator
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">
            QR-Code Bulk Generator
          </h1>
          <p className="text-lg text-gray-600">
            Erstellen Sie QR-Codes für mehrere Kontakte auf einmal
          </p>
        </div>
        
        {children}
        
        <div className="mt-16">
          <GuideSection />
        </div>
      </div>
    </div>
  );
};
