// Theme colors for Blue Sky Mountain Massage
// Light and dark blue tones inspired by mountain skies

export const colors = {
  // Primary - Sky Blue tones
  primary: {
    main: '#4A90B8',      // Sky blue
    light: '#87CEEB',     // Light sky blue
    dark: '#2C5F7C',      // Deep mountain blue
    contrast: '#FFFFFF',
  },
  
  // Secondary - Mountain/Nature tones
  secondary: {
    main: '#1E3A5F',      // Dark navy blue
    light: '#3D5A80',     // Soft navy
    dark: '#0D1B2A',      // Deep night sky
    contrast: '#FFFFFF',
  },
  
  // Accent - Natural earth/forest greens
  accent: {
    main: '#6B8E7D',      // Mountain sage
    light: '#8FB3A4',     // Light sage
    dark: '#4A6B5A',      // Forest green
  },
  
  // Background colors
  background: {
    primary: '#F5F9FC',   // Very light blue-white
    secondary: '#E8F1F8', // Light blue tint
    card: '#FFFFFF',
    dark: '#1A2634',      // Dark blue-gray
  },
  
  // Text colors
  text: {
    primary: '#1A2634',   // Dark blue-gray
    secondary: '#4A6079', // Blue-gray
    muted: '#8899A8',     // Light blue-gray
    light: '#FFFFFF',
    accent: '#4A90B8',    // Sky blue text
  },
  
  // Status colors
  status: {
    success: '#6B8E7D',   // Mountain sage
    warning: '#E6A23C',   // Warm amber
    error: '#C75450',     // Soft red
    info: '#4A90B8',      // Sky blue
  },
  
  // UI elements
  border: {
    light: '#D8E5EF',
    main: '#B8CFDF',
    dark: '#8AACBF',
  },
  
  // Overlay
  overlay: 'rgba(26, 38, 52, 0.5)',
};

export const typography = {
  fontFamily: {
    heading: 'System', // Will use system font, can be replaced with custom font
    body: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
