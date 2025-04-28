
/**
 * Generates a vCard string from contact data
 * @param {Object} contact - Contact data
 * @returns {string} vCard formatted string
 */
export const generateVCardData = (contact) => {
  const vcard = ["BEGIN:VCARD", "VERSION:3.0", 
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
  
  return vcard;
};

/**
 * Measures text dimensions in a canvas context
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to measure
 * @param {string} font - Font style
 * @returns {Object} Width and height of text
 */
export const measureText = (ctx, text, font) => {
  ctx.font = font;
  const metrics = ctx.measureText(text);
  return {
    width: metrics.width,
    height: parseInt(font, 10) * 1.2
  };
};

/**
 * Truncates text if it exceeds maxWidth
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to truncate
 * @param {number} maxWidth - Maximum width
 * @param {string} font - Font style
 * @returns {string} Truncated text
 */
export const truncateText = (ctx, text, maxWidth, font) => {
  if (!text) return '';
  
  let truncated = text;
  ctx.save();
  ctx.font = font;
  
  while (ctx.measureText(truncated).width > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }
  
  ctx.restore();
  
  if (truncated !== text && truncated.length > 3) {
    truncated = truncated.slice(0, -3) + '...';
  }
  
  return truncated;
};
