import { useState } from "react";
import { VCardForm, type VCardData } from "@/components/VCardForm";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";

const Index = () => {
  const [vCardData, setVCardData] = useState<VCardData>({
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
    <div className="min-h-screen bg-white">
      <div className="container py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-2">Your vCard QR-Code Generator</h1>
        <p className="text-center text-gray-600 mb-8">
          Erstellen Sie einen QR-Code für Ihre Kontaktdaten
        </p>
        
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
          <VCardForm onDataChange={setVCardData} />
          <div className="lg:sticky lg:top-8">
            <QRCodeDisplay data={vCardData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;