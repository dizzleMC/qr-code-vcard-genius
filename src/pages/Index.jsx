
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
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <nav className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-md bg-[#ff7e0c] text-white font-medium text-sm"
            >
              Einzel QR-Code
            </Link>
            <Link
              to="/premium"
              className="px-5 py-2.5 rounded-md text-[#8E9196] font-medium text-sm"
            >
              Premium Bulk-Generator
            </Link>
          </div>
        </nav>
        
        <div className="max-w-[768px] mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1A1F2C] mb-2">
            QR-Code Generator
          </h1>
          <p className="text-[#8E9196] text-lg">
            Erstellen Sie einen QR-Code für Ihre Kontaktdaten
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-sm p-8">
            <VCardForm onDataChange={setVCardData} />
          </div>
          <div className="w-full lg:w-1/2 lg:sticky lg:top-8">
            <QRCodeDisplay data={vCardData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
