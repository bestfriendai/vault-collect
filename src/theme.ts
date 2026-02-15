import { Platform, StyleSheet } from 'react-native';

export const colors = {
  brand: '#059669',
  brandLight: 'rgba(5, 150, 105, 0.1)',
  brandDark: '#047857',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F4',
  surfaceTertiary: '#E7E5E4',
  text: '#1A1A1A',
  textSecondary: 'rgba(26, 26, 26, 0.55)',
  textTertiary: 'rgba(26, 26, 26, 0.35)',
  border: '#E5E5E5',
  borderLight: '#F5F5F5',
  destructive: '#FF3B30',
  destructiveLight: 'rgba(255, 59, 48, 0.1)',
  success: '#34C759',
  successLight: 'rgba(52, 199, 89, 0.1)',
  warning: '#FF9500',
  warningLight: 'rgba(255, 149, 0, 0.1)',
  white: '#FFFFFF',
  black: '#000000',
  dark: {
    background: '#0A0A0A',
    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',
    surfaceTertiary: '#3C3C3E',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    textTertiary: 'rgba(255, 255, 255, 0.35)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.04)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const fontSize = {
  caption: 13,
  body: 17,
  bodySmall: 15,
  title3: 20,
  title2: 22,
  largeTitle: 34,
  footnote: 12,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadows = {
  sm: Platform.OS === 'ios' ? {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  } : { elevation: 1 },
  md: Platform.OS === 'ios' ? {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  } : { elevation: 2 },
  lg: Platform.OS === 'ios' ? {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  } : { elevation: 4 },
};

export const hitSlop = {
  top: 8,
  bottom: 8,
  left: 8,
  right: 8,
};
