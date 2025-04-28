import { generateVCardData, truncateText } from './qrCodeUtils';

/**
 * Generates name tag dimensions based on size setting
 * @param {string} size - Size setting (small, medium, large)
 * @returns {Object} Dimensions and properties for the name tag
 */
export const getDimensions = (size) => {
  console.log("getDimensions called with size:", size);
  
  // Provide fallback if size is undefined or not recognized
  const validSize = size && ["small", "medium", "large"].includes(size) 
    ? size 
    : "medium";
    
  console.log("Using size value:", validSize);
    
  switch(validSize) {
    case "small": return { width: 350, height: 175, fontSize: 18, qrSize: 100 };
    case "large": return { width: 450, height: 225, fontSize: 26, qrSize: 150 };
    case "medium":
    default: return { width: 400, height: 200, fontSize: 22, qrSize: 120 };
  }
};

/**
 * Returns template-specific positioning for name tag elements
 * @param {string} template - Template name 
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} qrSize - QR code size
 * @returns {Object} Position coordinates for name tag elements
 */
export const getTemplatePosition = (template, width, height, qrSize) => {
  switch(template) {
    case "modern":
      return {
        nameX: width * 0.88,
        nameY: height / 2 - 10,
        titleX: width * 0.88,
        titleY: height / 2 + 15,
        companyX: width * 0.88,
        companyY: height / 2 + 40,
        qrX: width * 0.25,
        qrY: height / 2,
        logoX: width * 0.88,
        logoY: height * 0.15,
        logoAlign: "right",
        textAlign: "right",
        qrSize: qrSize
      };
    case "business":
      return {
        nameX: width / 2,
        nameY: height * 0.42,
        titleX: width / 2,
        titleY: height * 0.42 + 25,
        companyX: width / 2,
        companyY: height * 0.42 + 50,
        qrX: width - qrSize/2 - 15,
        qrY: height - qrSize/2 - 15,
        logoX: width / 2,
        logoY: height * 0.18,
        logoAlign: "center",
        textAlign: "center",
        qrSize: qrSize
      };
    case "minimal":
      return {
        nameX: width / 2,
        nameY: height / 2 - 10,
        titleX: width / 2,
        titleY: height / 2 + 15,
        companyX: width / 2,
        companyY: height / 2 + 40,
        qrX: width - qrSize/1.6,
        qrY: height / 2,
        logoX: width * 0.2,
        logoY: height / 2,
        logoAlign: "center",
        textAlign: "center",
        qrSize: qrSize
      };
    case "classic":
    default:
      return {
        nameX: width * 0.08,
        nameY: height / 2 - 10,
        titleX: width * 0.08,
        titleY: height / 2 + 15,
        companyX: width * 0.08,
        companyY: height / 2 + 40,
        qrX: width - qrSize/1.6,
        qrY: height / 2,
        logoX: width * 0.08,
        logoY: height * 0.15,
        logoAlign: "left",
        textAlign: "left",
        qrSize: qrSize
      };
  }
};

/**
 * Generates a template-specific background for the name tag
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} template - Template name
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {string} backgroundColor - Background color
 * @param {string} borderColor - Border color
 */
export const createTemplateBackground = (ctx, template, width, height, backgroundColor, borderColor) => {
  ctx.fillStyle = backgroundColor || "#ffffff";
  ctx.fillRect(0, 0, width, height);
  
  let gradient;
  
  switch(template) {
    case "modern":
      gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, backgroundColor || "#ffffff");
      gradient.addColorStop(0.7, backgroundColor || "#ffffff");
      gradient.addColorStop(1, borderColor + "30");
      break;
    case "business":
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, backgroundColor || "#ffffff");
      gradient.addColorStop(0.7, backgroundColor || "#ffffff");
      gradient.addColorStop(1, borderColor + "30");
      break;
    case "minimal":
      gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, backgroundColor || "#ffffff");
      gradient.addColorStop(0.85, backgroundColor || "#ffffff");
      gradient.addColorStop(1, borderColor + "15");
      break;
    case "classic":
    default:
      gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, backgroundColor || "#ffffff");
      gradient.addColorStop(0.75, backgroundColor || "#ffffff");
      gradient.addColorStop(1, borderColor + "25");
      break;
  }
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.strokeStyle = borderColor || "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);
};

/**
 * Generates a name tag as a blob
 * @param {Object} contact - Contact data
 * @param {Object} nameTagSettings - Name tag settings
 * @returns {Promise<Blob>} Generated name tag as a blob
 */
export const generateNameTag = async (contact, nameTagSettings) => {
  console.log("generateNameTag called with settings:", nameTagSettings);
  
  if (!nameTagSettings) {
    console.error("nameTagSettings is undefined");
    throw new Error("Name tag settings are required");
  }
  
  if (!nameTagSettings.size || !["small", "medium", "large"].includes(nameTagSettings.size)) {
    console.warn("Size not specified or invalid in nameTagSettings, defaulting to medium");
    nameTagSettings.size = "medium";
  }
  
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    console.error("Canvas context could not be created");
    throw new Error("Canvas context could not be created");
  }
  
  try {
    const sizeSetting = nameTagSettings.size || "medium";
    console.log("Using size setting:", sizeSetting);
    
    const dimensions = getDimensions(sizeSetting);
    console.log("Calculated dimensions:", dimensions);
    
    if (!dimensions) {
      console.error("Failed to get dimensions, using default medium size");
      dimensions = { width: 400, height: 200, fontSize: 22, qrSize: 120 };
    }
    
    const { width, height, fontSize } = dimensions;
    canvas.width = width;
    canvas.height = height;
    
    const template = nameTagSettings.template || "classic";
    const backgroundColor = nameTagSettings.backgroundColor || "#ffffff";
    const borderColor = nameTagSettings.borderColor || "#e2e8f0";
    
    console.log("Drawing template background:", template);
    createTemplateBackground(ctx, template, width, height, backgroundColor, borderColor);
    
    const qrSize = dimensions.qrSize || (template === "business" ? height * 0.65 : height * 0.7);
    const templatePosition = getTemplatePosition(template, width, height, qrSize);
    
    ctx.textAlign = templatePosition.textAlign;
    
    ctx.fillStyle = nameTagSettings.qrBgColor || "#ffffff";
    ctx.fillRect(
      templatePosition.qrX - (templatePosition.qrSize / 2) - 10, 
      templatePosition.qrY - (templatePosition.qrSize / 2) - 10, 
      templatePosition.qrSize + 20, 
      templatePosition.qrSize + 20
    );
    
    if (nameTagSettings.logo) {
      const img = new Image();
      try {
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = nameTagSettings.logo;
        });
        
        if (img.complete && img.naturalWidth > 0) {
          const scale = nameTagSettings.logoScale / 100;
          const logoWidth = img.width * scale;
          const logoHeight = img.height * scale;
          const maxLogoHeight = height * 0.3;
          const maxLogoWidth = width * 0.6;
          
          const ratio = Math.min(
            maxLogoHeight / logoHeight, 
            maxLogoWidth / logoWidth, 
            1
          );
          
          const finalLogoWidth = logoWidth * ratio;
          const finalLogoHeight = logoHeight * ratio;
          
          let logoXPos;
          if (templatePosition.logoAlign === "center") {
            logoXPos = templatePosition.logoX - (finalLogoWidth / 2);
          } else if (templatePosition.logoAlign === "right") {
            logoXPos = templatePosition.logoX - finalLogoWidth;
          } else {
            logoXPos = templatePosition.logoX;
          }
            
          ctx.drawImage(
            img, 
            logoXPos,
            templatePosition.logoY - (finalLogoHeight / 2),
            finalLogoWidth,
            finalLogoHeight
          );
        }
      } catch (err) {
        console.error("Error loading logo:", err);
      }
    }
    
    try {
      const { toCanvas } = await import('qrcode');
      const vcard = generateVCardData(contact);
      
      const qrCanvas = document.createElement("canvas");
      
      await toCanvas(qrCanvas, vcard, {
        width: templatePosition.qrSize,
        margin: 1,
        color: {
          dark: nameTagSettings.qrFgColor || "#000000",
          light: nameTagSettings.qrBgColor || "#ffffff"
        },
        errorCorrectionLevel: 'M'
      });
      
      ctx.drawImage(
        qrCanvas, 
        templatePosition.qrX - (templatePosition.qrSize / 2), 
        templatePosition.qrY - (templatePosition.qrSize / 2), 
        templatePosition.qrSize, 
        templatePosition.qrSize
      );
    } catch (error) {
      console.error("Error generating QR code for name tag:", error);
    }
    
    const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || "Name";
    const company = (contact.company || '').trim();
    const title = (contact.title || '').trim();
    
    const nameFontSize = Math.max(fontSize, 18);
    const titleFontSize = Math.max(fontSize - 6, 12);
    const companyFontSize = Math.max(fontSize - 4, 14);
    
    const nameFont = `bold ${nameFontSize}px ${nameTagSettings.font || 'Arial'}`;
    const titleFont = `${titleFontSize}px ${nameTagSettings.font || 'Arial'}`;
    const companyFont = `${companyFontSize}px ${nameTagSettings.font || 'Arial'}`;
    
    const textPadding = 20;
    const maxNameWidth = template === "business" ? width * 0.8 : 
      templatePosition.textAlign === "center" ? width * 0.6 : 
      templatePosition.textAlign === "right" ? width * 0.5 : 
      width - templatePosition.qrSize - textPadding * 3;
    
    ctx.font = nameFont;
    ctx.fillStyle = nameTagSettings.nameColor || "#1A1F2C";
    const truncatedName = truncateText(ctx, fullName, maxNameWidth, nameFont);
    ctx.fillText(truncatedName, templatePosition.nameX, templatePosition.nameY);
    
    if (title) {
      ctx.font = titleFont;
      ctx.fillStyle = nameTagSettings.companyColor || "#8E9196";
      const truncatedTitle = truncateText(ctx, title, maxNameWidth, titleFont);
      ctx.fillText(truncatedTitle, templatePosition.titleX, templatePosition.titleY);
    }
    
    if (company) {
      ctx.font = companyFont;
      ctx.fillStyle = nameTagSettings.companyColor || "#8E9196";
      const truncatedCompany = truncateText(ctx, company, maxNameWidth, companyFont);
      ctx.fillText(truncatedCompany, templatePosition.companyX, templatePosition.companyY);
    }
    
    console.log("Generating blob from canvas");
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          console.log("Blob created successfully:", blob.size, "bytes");
          resolve(blob);
        } else {
          console.error("Failed to create blob from canvas");
          reject(new Error("Failed to create name tag"));
        }
      }, "image/png");
    });
  } catch (error) {
    console.error("Error in generateNameTag:", error);
    throw new Error(`Failed to generate name tag: ${error.message}`);
  }
};
