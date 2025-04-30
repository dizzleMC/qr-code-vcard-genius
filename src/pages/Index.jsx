
import { useState } from "react";
import { VCardForm } from "@/components/VCardForm";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Link } from "react-router-dom";

const Index = () => {
  const [vCardData, setVCardData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <nav className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-md p-1 inline-flex">
            <Link
              to="/"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#ff7e0c] to-[#ff9a41] text-white font-medium text-sm shadow-sm transition-transform hover:scale-[1.02]"
            >
              Einzel QR-Code
            </Link>
            <Link
              to="/premium"
              className="px-6 py-2.5 rounded-lg text-[#8E9196] font-medium text-sm transition-all hover:text-gray-700"
            >
              Premium Bulk-Generator
            </Link>
          </div>
        </nav>
        
        <div className="text-center mb-10">
          <p className="text-accent font-medium mb-2">Features</p>
          <h1 className="text-4xl font-bold text-[#1A1F2C] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#1A1F2C] to-[#4A5568]">
            QR-Code Generator
          </h1>
          <p className="text-[#64748b] max-w-2xl mx-auto">
            Erstellen Sie einen QR-Code für Ihre Kontaktdaten
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="w-full lg:w-1/2 bg-white border border-gray-100 rounded-xl shadow-card p-8 animate-fade-in">
            <VCardForm onDataChange={setVCardData} />
          </div>
          <div className="w-full lg:w-1/2 lg:sticky lg:top-8 animate-fade-in" style={{animationDelay: "0.2s"}}>
            <QRCodeDisplay data={vCardData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
