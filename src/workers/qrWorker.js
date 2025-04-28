
import { QRCodeSVG } from 'qrcode.react';
import { renderToString } from 'react-dom/server';

self.onmessage = async function(e) {
  const { contact, settings, index, total } = e.data;
  
  try {
    const vCardData = generateVCardData(contact);
    
    // Generate QR code SVG
    const qrCodeSvg = renderToString(
      <QRCodeSVG
        value={vCardData}
        size={settings.size}
        level="H"
        includeMargin={true}
        fgColor={settings.fgColor}
        bgColor={settings.bgColor}
      />
    );

    // Convert SVG to blob
    const svgBlob = new Blob([qrCodeSvg], { type: 'image/svg+xml' });
    
    self.postMessage({
      success: true,
      fileName: `${contact.firstName}-${contact.lastName}-qr.png`,
      blob: svgBlob,
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
