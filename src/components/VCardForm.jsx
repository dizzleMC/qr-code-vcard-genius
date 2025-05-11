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

  const inputStyle = {
    marginTop: "0.25rem",
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #e2e8f0",
    borderRadius: "0.375rem",
    fontSize: "1rem"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.25rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#1A1F2C"
  };

  const formGroupStyle = {
    marginBottom: "1rem"
  };

  const gridContainerStyle = {
    display: "grid",
    gap: "1rem"
  };

  const twoColumnGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem"
  };

  return (
    <div style={{ width: "100%", maxWidth: "36rem" }}>
      <div style={gridContainerStyle}>
        <div style={twoColumnGridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="firstName">Vorname</label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="lastName">Nachname</label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>
        
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="title">Titel/Position</label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="company">Unternehmen</label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="email">E-Mail</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="phone">Telefon</label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="website">Website</label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="street">Straße</label>
          <Input
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={twoColumnGridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="city">Stadt</label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="state">Bundesland</label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={twoColumnGridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="zip">PLZ</label>
            <Input
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="country">Land</label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};