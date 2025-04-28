
import { useState } from 'react';

/**
 * Custom hook for managing template settings state
 * @param {Object} initialSettings - Initial template settings
 * @returns {Array} [templateSettings, handleTemplateChange, applyQRConfig]
 */
export const useTemplateSettings = (initialSettings) => {
  const [templateSettings, setTemplateSettings] = useState(initialSettings || {
    size: 200,
    fgColor: "#1A1F2C",
    bgColor: "#ffffff",
    nameTag: {
      enabled: false,
      template: "classic",
      size: "medium",
      font: "Inter",
      fontSize: 22,
      nameColor: "#1A1F2C",
      companyColor: "#8E9196",
      logo: null,
      logoScale: 100,
      backgroundColor: "#ffffff",
      borderColor: "#e2e8f0",
      qrFgColor: "#000000",
      qrBgColor: "#ffffff"
    }
  });

  /**
   * Updates a specific template setting
   * @param {string} setting - Setting key
   * @param {any} value - New setting value
   */
  const handleTemplateChange = (setting, value) => {
    setTemplateSettings({
      ...templateSettings,
      [setting]: value
    });
  };

  return [templateSettings, handleTemplateChange];
};
