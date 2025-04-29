
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const VCardForm = ({ onDataChange }) => {
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onDataChange(newData);
    
    if (name === "email" && value && !value.includes("@")) {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein");
    }
  };

  return (
    <div className="w-full max-w-xl">
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-[#1A1F2C]">Vorname</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="border-gray-200 focus:border-[#ff7e0c] focus:ring-[#ff7e0c]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-[#1A1F2C]">Nachname</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border-gray-200 focus:border-[#ff7e0c] focus:ring-[#ff7e0c]"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-[#1A1F2C]">Titel/Position</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border-gray-200 focus:border-[#ff7e0c] focus:ring-[#ff7e0c]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-sm font-medium text-[#1A1F2C]">Unternehmen</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="border-gray-200 focus:border-[#ff7e0c] focus:ring-[#ff7e0c]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-[#1A1F2C]">E-Mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="border-gray-200 focus:border-[#ff7e0c] focus:ring-[#ff7e0c]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-[#1A1F2C]">Telefon</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="border-gray-200 focus:border-[#ff7e0c] focus:ring-[#ff7e0c]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-sm font-medium text-[#1A1F2C]">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            className="border-gray-200 focus:border-[#ff7e0c] focus:ring-[#ff7e0c]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="street" className="text-sm font-medium text-[#1A1F2C]">Straße</Label>
          <Input
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="border-gray-200 focus:border-[#ff7e0c] focus:ring-[#ff7e0c]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-[#1A1F2C]">Stadt</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="border-gray-200 focus:border-[#ff7e0c] focus:ring-[#ff7e0c]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium text-[#1A1F2C]">Bundesland</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="border-gray-200 focus:border-[#ff7e0c] focus:ring-[#ff7e0c]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zip" className="text-sm font-medium text-[#1A1F2C]">PLZ</Label>
            <Input
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="border-gray-200 focus:border-[#ff7e0c] focus:ring-[#ff7e0c]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium text-[#1A1F2C]">Land</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="border-gray-200 focus:border-[#ff7e0c] focus:ring-[#ff7e0c]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
