
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface VCardData {
  firstName: string;
  lastName: string;
  academicTitle: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface VCardFormProps {
  onDataChange: (data: VCardData) => void;
}

export const VCardForm = ({ onDataChange }: VCardFormProps) => {
  const [formData, setFormData] = useState<VCardData>({
    firstName: "",
    lastName: "",
    academicTitle: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onDataChange(newData);
    
    if (name === "email" && value && !value.includes("@")) {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein");
    }
  };

  return (
    <div className="grid gap-6 w-full max-w-xl">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="academicTitle">Akademischer Titel</Label>
          <Input
            id="academicTitle"
            name="academicTitle"
            value={formData.academicTitle}
            onChange={handleChange}
            className="mt-1"
            placeholder="z.B. Dr., Prof."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Vorname</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Nachname</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="title">Titel/Position</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="company">Unternehmen</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="street">Straße</Label>
          <Input
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Stadt</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="state">Bundesland</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zip">PLZ</Label>
            <Input
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="country">Land</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
