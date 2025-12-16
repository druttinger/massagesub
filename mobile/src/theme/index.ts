// Theme colors matching Golden Ayurveda & Massage branding
// Inspired by https://goldenayurvedamassage.com/

export const colors = {
  // Primary - Golden/Amber tones
  primary: {
    main: '#C9A86C',      // Warm gold
    light: '#E5D4B3',     // Light gold/cream
    dark: '#9E7E3E',      // Deep gold
    contrast: '#FFFFFF',
  },
  
  // Secondary - Earth tones
  secondary: {
    main: '#5C4033',      // Brown
    light: '#8B6F47',     // Light brown
    dark: '#3D2B22',      // Dark brown
    contrast: '#FFFFFF',
  },
  
  // Accent - Sage/Wellness greens
  accent: {
    main: '#7D8B6A',      // Sage green
    light: '#A8B496',     // Light sage
    dark: '#5A6349',      // Dark sage
  },
  
  // Background colors
  background: {
    primary: '#FBF9F5',   // Warm off-white
    secondary: '#F5F0E6', // Cream
    card: '#FFFFFF',
    dark: '#2C2420',      // Dark background
  },
  
  // Text colors
  text: {
    primary: '#2C2420',   // Almost black, warm
    secondary: '#6B5E54', // Brown-gray
    muted: '#9A8F85',     // Light brown-gray
    light: '#FFFFFF',
    accent: '#C9A86C',    // Gold text
  },
  
  // Status colors
  status: {
    success: '#7D8B6A',   // Sage green
    warning: '#D4A84B',   // Amber
    error: '#B85450',     // Muted red
    info: '#6B8FAD',      // Muted blue
  },
  
  // UI elements
  border: {
    light: '#E8E2D9',
    main: '#D4CBC0',
    dark: '#B5A999',
  },
  
  // Overlay
  overlay: 'rgba(44, 36, 32, 0.5)',
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
