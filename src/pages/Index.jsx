import { useState } from "react";
import { VCardForm } from "@/components/VCardForm";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";

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
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container py-12 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-semibold text-[#1A1F2C] mb-3">Your vCard QR-Code Generator</h1>
          <p className="text-[#8E9196] text-lg">
            Erstellen Sie einen QR-Code für Ihre Kontaktdaten
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-16 items-start justify-center">
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