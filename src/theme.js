/**
 * Vuetify 3 Theme Configuration
 * ===================================
 * Professional, clean design system inspired by Linear, Notion, and Airtable
 * Color Palette: Soft neutral background with accent colors
 * Density: Comfortable spacing for all components
 * Elevation: Light, subtle shadow hierarchy
 */

export const lightTheme = {
  dark: false,
  colors: {
    // Primary Brand Colors
    primary: '#5E6AD2', // Deep indigo - professional and trustworthy
    primaryLight: '#7B83E8',
    primaryDark: '#4A55B8',

    // Secondary Colors
    secondary: '#7C3AED', // Purple - accent for secondary actions
    secondaryLight: '#9F63F7',
    secondaryDark: '#6D28D9',

    // Success States
    success: '#10B981', // Emerald - positive actions, confirmations
    successLight: '#34D399',
    successDark: '#059669',

    // Warning States
    warning: '#F59E0B', // Amber - caution, pending actions
    warningLight: '#FBBF24',
    warningDark: '#D97706',

    // Error States
    error: '#EF4444', // Red - destructive, errors
    errorLight: '#F87171',
    errorDark: '#DC2626',

    // Information
    info: '#3B82F6', // Blue - informational, neutral actions
    infoLight: '#60A5FA',
    infoDark: '#1D4ED8',

    // Background
    background: '#F9FAFB', // Off-white, very light gray
    surface: '#FFFFFF', // Pure white for cards
    surfaceVariant: '#F3F4F6', // Light gray for sections

    // Text Colors
    textPrimary: '#1F2937', // Dark gray - primary text
    textSecondary: '#6B7280', // Medium gray - secondary text
    textTertiary: '#9CA3AF', // Light gray - tertiary text
    textInverse: '#FFFFFF', // For text on dark backgrounds

    // Border Colors
    borderLight: '#E5E7EB', // Very light gray
    borderDefault: '#D1D5DB', // Light gray
    borderDark: '#9CA3AF', // Medium gray

    // Overlay & Hover States
    overlay: 'rgba(0, 0, 0, 0.04)', // Subtle overlay
    hoverOverlay: 'rgba(0, 0, 0, 0.06)', // Hover overlay

    // Component-specific
    divider: '#E5E7EB',
    disabled: '#D1D5DB',
  },
  
  typography: {
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    fontWeightBolder: 700,

    h1: {
      size: '32px',
      weight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.5px',
    },
    h2: {
      size: '28px',
      weight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.3px',
    },
    h3: {
      size: '24px',
      weight: 600,
      lineHeight: 1.35,
      letterSpacing: '0px',
    },
    h4: {
      size: '20px',
      weight: 600,
      lineHeight: 1.4,
      letterSpacing: '0px',
    },
    h5: {
      size: '16px',
      weight: 600,
      lineHeight: 1.5,
      letterSpacing: '0px',
    },
    h6: {
      size: '14px',
      weight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.1px',
    },
    body1: {
      size: '14px',
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.2px',
    },
    body2: {
      size: '12px',
      weight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.2px',
    },
    button: {
      size: '14px',
      weight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.2px',
      textTransform: 'none', // Disable default uppercase
    },
    caption: {
      size: '12px',
      weight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.3px',
    },
    label: {
      size: '13px',
      weight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.1px',
    },
  },

  shadows: {
    elevation: {
      0: 'none',
      1: '0px 1px 2px rgba(0, 0, 0, 0.05)',
      2: '0px 2px 4px rgba(0, 0, 0, 0.05)',
      3: '0px 4px 6px rgba(0, 0, 0, 0.07)',
      4: '0px 4px 12px rgba(0, 0, 0, 0.08)',
      5: '0px 8px 16px rgba(0, 0, 0, 0.10)',
      6: '0px 12px 24px rgba(0, 0, 0, 0.12)',
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
  },

  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  componentDefaults: {
    button: {
      textTransform: 'none',
      fontWeight: 500,
      padding: '8px 16px',
      minHeight: '36px',
      borderRadius: '8px',
    },
    card: {
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    },
    input: {
      borderRadius: '8px',
      padding: '10px 12px',
      minHeight: '40px',
    },
    dialog: {
      borderRadius: '12px',
      boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.12)',
    },
  },
}

/**
 * Vuetify 3 Theme Export for vuetify.config.js
 */
export default {
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: lightTheme.colors,
      },
    },
    variables: {
      'font-size-root': '14px',
      'letter-spacing-root': '0.2px',
    },
  },
  typography: lightTheme.typography,
}
