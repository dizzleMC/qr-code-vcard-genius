
import { Link } from "react-router-dom";

export const PremiumLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex justify-center mb-10">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-1 inline-flex">
            <Link
              to="/"
              className="px-5 py-2 rounded-md text-slate-600 font-medium text-sm transition-all hover:text-gray-700"
            >
              Einzel QR-Code
            </Link>
            <Link
              to="/premium"
              className="px-5 py-2 rounded-md bg-orange-500 text-white font-medium text-sm shadow-sm transition-transform hover:scale-[1.02]"
            >
              Premium Bulk-Generator
            </Link>
          </div>
        </nav>
        
        {children}
      </div>
    </div>
  );
};
