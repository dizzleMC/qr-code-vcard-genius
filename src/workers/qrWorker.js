
import QRCode from 'qrcode';

self.onmessage = async function(e) {
  const { contact, settings, index, total } = e.data;
  
  try {
    const vCardData = generateVCardData(contact);
    
    // Generate QR code using QRCode lib instead of React component
    const qrCodeDataURL = await QRCode.toDataURL(vCardData, {
      width: settings.size,
      margin: 4,
      color: {
        dark: settings.fgColor,
        light: settings.bgColor
      },
      errorCorrectionLevel: 'H'
    });
    
    // Convert data URL to blob
    const response = await fetch(qrCodeDataURL);
    const blob = await response.blob();
    
    self.postMessage({
      success: true,
      fileName: `${contact.firstName}-${contact.lastName}-qr.png`,
      blob: blob,
      progress: ((index + 1) / total) * 100
    });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message,
      progress: ((index + 1) / total) * 100
    });
  }
};

function generateVCardData(contact) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${contact.lastName || ''};${contact.firstName || ''};;;`,
    `FN:${contact.firstName || ''} ${contact.lastName || ''}`,
    contact.title && `TITLE:${contact.title}`,
    contact.company && `ORG:${contact.company}`,
    contact.email && `EMAIL:${contact.email}`,
    contact.phone && `TEL:${contact.phone}`,
    contact.website && `URL:${contact.website}`,
    (contact.street || contact.city) && 
      `ADR:;;${contact.street || ''};${contact.city || ''};${contact.state || ''};${contact.zip || ''};${contact.country || ''}`,
    "END:VCARD"
  ].filter(Boolean).join("\n");
}
