/**
 * Brand Compliance Checker
 * Validates that the calculator adheres to HDFC brand guidelines
 */

// HDFC Brand Colors
const HDFC_BRAND_COLORS = {
  primary_blue: '#224c87',
  primary_red: '#da3832',
  neutral_grey: '#919090',
  white: '#ffffff',
  black: '#000000',
};

// HDFC Approved Fonts
const HDFC_APPROVED_FONTS = [
  'Montserrat',
  'Arial',
  'Verdana',
  'sans-serif',
];

/**
 * Check if color is HDFC-approved
 * @param {string} color - CSS color value
 * @returns {boolean} True if approved
 */
export const isApprovedColor = (color) => {
  const normalizedColor = color.toLowerCase().trim();
  const approvedValues = Object.values(HDFC_BRAND_COLORS).map((c) => c.toLowerCase());
  return approvedValues.includes(normalizedColor);
};

/**
 * Check if font is HDFC-approved
 * @param {string} fontFamily - CSS font-family value
 * @returns {boolean} True if approved
 */
export const isApprovedFont = (fontFamily) => {
  if (!fontFamily) return false;
  
  const fonts = fontFamily.split(',').map((f) => f.trim().toLowerCase());
  
  return fonts.some((font) => {
    const cleanFont = font.replace(/['"]/g, '');
    return HDFC_APPROVED_FONTS.some((approved) =>
      cleanFont.includes(approved.toLowerCase())
    );
  });
};

/**
 * Brand compliance checklist
 */
export const BRAND_COMPLIANCE_CHECKLIST = {
  colors: {
    description: 'Only HDFC approved colors are used',
    required: true,
    status: null,
    details: Object.entries(HDFC_BRAND_COLORS)
      .map(([name, value]) => `${name}: ${value}`)
      .join(', '),
  },
  fonts: {
    description: 'Only HDFC approved fonts are used',
    required: true,
    status: null,
    details: HDFC_APPROVED_FONTS.join(', '),
  },
  imagery: {
    description: 'No financial imagery (growth arrows, money icons, etc.)',
    required: true,
    status: null,
  },
  language: {
    description: 'Neutral, factual, illustrative language only',
    required: true,
    status: null,
    prohibitedPhrases: [
      'grow your wealth',
      'start investing today',
      'guaranteed returns',
      'risk-free',
      'beat the market',
    ],
  },
  disclaimer: {
    description: 'HDFC disclaimer is visible and prominent',
    required: true,
    status: null,
    minFontSize: 14,
    minContrast: 4.5,
  },
  accessibility: {
    description: 'WCAG 2.1 AA accessibility compliance',
    required: true,
    status: null,
  },
};

/**
 * Check for prohibited phrases in text
 * @param {string} text - Text to check
 * @returns {Array<string>} Found prohibited phrases
 */
export const findProhibitedPhrases = (text) => {
  const prohibited = BRAND_COMPLIANCE_CHECKLIST.language.prohibitedPhrases;
  const lowerText = text.toLowerCase();
  const found = [];

  prohibited.forEach((phrase) => {
    if (lowerText.includes(phrase.toLowerCase())) {
      found.push(phrase);
    }
  });

  return found;
};

/**
 * Validate CSS variable usage
 * @param {string} cssContent - CSS content to validate
 * @returns {Object} Validation result
 */
export const validateCSSVariables = (cssContent) => {
  const issues = [];
  
  // Check for hardcoded colors
  const colorRegex = /#[0-9a-fA-F]{6}|rgb\([^)]+\)|hsl\([^)]+\)/g;
  const colors = cssContent.match(colorRegex) || [];
  
  const unapprovedColors = colors.filter((color) => !isApprovedColor(color));
  
  if (unapprovedColors.length > 0) {
    issues.push({
      type: 'color',
      severity: 'high',
      message: `Unapproved colors found: ${unapprovedColors.join(', ')}`,
      colors: unapprovedColors,
    });
  }

  // Check for font declarations
  const fontRegex = /font-family\s*:\s*[^;]+/gi;
  const fonts = cssContent.match(fontRegex) || [];
  
  fonts.forEach((fontDecl) => {
    const fontValue = fontDecl.split(':')[1].trim();
    if (!isApprovedFont(fontValue)) {
      issues.push({
        type: 'font',
        severity: 'high',
        message: `Unapproved font found: ${fontValue}`,
        font: fontValue,
      });
    }
  });

  return {
    isCompliant: issues.length === 0,
    issues,
  };
};

/**
 * Generate brand compliance report
 * @param {Object} checkResults - Results of compliance checks
 * @returns {Object} Compliance report
 */
export const generateComplianceReport = (checkResults) => {
  const passed = Object.values(checkResults).filter((check) => check.status === true).length;
  const failed = Object.values(checkResults).filter((check) => check.status === false).length;
  const total = Object.keys(checkResults).length;
  const score = ((passed / total) * 100).toFixed(1);

  return {
    score,
    passed,
    failed,
    total,
    isCompliant: failed === 0,
    checks: checkResults,
    generatedAt: new Date().toISOString(),
  };
};