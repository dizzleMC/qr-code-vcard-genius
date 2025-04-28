
import { Link } from "react-router-dom";
import { GuideSection } from "@/components/GuideSection";

export const PremiumLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FCFCFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <nav className="mb-12">
          <ul className="flex justify-center gap-12">
            <li>
              <Link 
                to="/"
                className="text-gray-500 hover:text-gray-900 font-medium transition-colors"
              >
                Einzel QR-Code
              </Link>
            </li>
            <li>
              <Link 
                to="/premium"
                className="text-[#ff7e0c] font-medium border-b-2 border-[#ff7e0c] pb-1"
              >
                Premium Bulk-Generator
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            QR-Code Bulk Generator
          </h1>
          <p className="text-lg text-gray-600">
            Erstellen Sie QR-Codes für mehrere Kontakte auf einmal
          </p>
        </div>
        
        {children}
        
        <div className="mt-24">
          <GuideSection />
        </div>
      </div>
    </div>
  );
};
