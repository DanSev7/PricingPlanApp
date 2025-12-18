/**
 * Common styles used across the application for consistent UI/UX
 * This file centralizes reusable styles to maintain design consistency
 */

import { StyleSheet } from 'react-native';

// Color constants (should match your theme)
export const COLORS = {
  // Background colors
  BACKGROUND_DARK: '#0f172b',
  CARD_BACKGROUND: '#1d293b',
  
  // Accent colors
  PRIMARY_TINT: '#09b6d4',
  ERROR_RED: '#ff6b6b',
  
  // Text colors
  TEXT_LIGHT: '#ffffff',
  TEXT_SECONDARY: 'rgba(255, 255, 255, 0.8)',
  TEXT_PLACEHOLDER: 'rgba(255, 255, 255, 0.3)',
  
  // Border colors
  BORDER_DEFAULT: 'rgba(255, 255, 255, 0.1)',
  BORDER_ACCENT: '#09b6d420',
};

// Common spacing values
export const SPACING = {
  XXS: 4,
  XS: 8,
  SM: 12,
  MD: 16,
  LG: 20,
  XL: 24,
  XXL: 32,
};

// Common border radius values
export const BORDER_RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 25,
};

// Common font sizes
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 28,
  TITLE: 30,
};

// Common shadows
export const SHADOWS = {
  LIGHT: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  HEAVY: {
    shadowColor: '#09b6d4',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  ACCENT: {
    shadowColor: '#09b6d4',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  }
};

// Reusable component styles
export const CommonStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },
  
  // Card styles
  card: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: BORDER_RADIUS.XXL,
    padding: SPACING.MD,
    borderWidth: 0.5,
    borderColor: COLORS.BORDER_ACCENT,
    ...SHADOWS.HEAVY,
  },
  
  cardWithPadding: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: BORDER_RADIUS.XXL,
    padding: SPACING.LG,
    borderWidth: 0.5,
    borderColor: COLORS.BORDER_ACCENT,
    ...SHADOWS.HEAVY,
  },
  
  // Section styles
  section: {
    marginBottom: SPACING.LG,
    borderRadius: BORDER_RADIUS.XXL,
    padding: SPACING.MD,
    borderWidth: 0.5,
    borderColor: COLORS.BORDER_ACCENT,
    ...SHADOWS.HEAVY,
  },
  
  sectionWithTitle: {
    marginBottom: SPACING.LG,
    borderRadius: BORDER_RADIUS.XXL,
    padding: SPACING.LG,
    borderWidth: 0.5,
    borderColor: COLORS.BORDER_ACCENT,
    ...SHADOWS.HEAVY,
  },
  
  // Text styles
  title: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: FONT_SIZES.XXL,
    fontWeight: '600',
    marginBottom: SPACING.MD,
    textAlign: 'center',
  },
  
  sectionTitle: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '600',
    marginBottom: SPACING.MD,
    textAlign: 'center',
    borderBottomWidth: 1,
    paddingBottom: SPACING.XS / 2,
    borderColor: COLORS.PRIMARY_TINT + '40',
  },
  
  label: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '300',
    marginBottom: SPACING.SM,
  },
  
  bodyText: {
    fontSize: FONT_SIZES.MD,
    lineHeight: 24,
    opacity: 0.9,
  },
  
  // Form styles
  inputGroup: {
    marginBottom: SPACING.MD,
    backgroundColor: 'transparent',
  },
  
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.SM,
    fontSize: FONT_SIZES.MD,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  
  textArea: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.SM,
    fontSize: FONT_SIZES.MD,
    height: 120,
    backgroundColor: COLORS.BACKGROUND_DARK,
  },
  
  errorText: {
    color: COLORS.ERROR_RED,
    fontSize: FONT_SIZES.SM,
    marginTop: SPACING.XS,
    fontStyle: 'italic',
  },
  
  // Button styles
  primaryButton: {
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    marginTop: SPACING.SM,
    ...SHADOWS.MEDIUM,
  },
  
  primaryButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
  },
  
  // Layout styles
  row: {
    flexDirection: 'row',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  // Margin helpers
  marginBottomSm: {
    marginBottom: SPACING.SM,
  },
  
  marginBottomMd: {
    marginBottom: SPACING.MD,
  },
  
  marginBottomLg: {
    marginBottom: SPACING.LG,
  },
  
  marginTopSm: {
    marginTop: SPACING.SM,
  },
  
  marginTopMd: {
    marginTop: SPACING.MD,
  },
  
  marginHorizontalMd: {
    marginHorizontal: SPACING.MD,
  },
  
  // Padding helpers
  paddingMd: {
    padding: SPACING.MD,
  },
  
  paddingLg: {
    padding: SPACING.LG,
  },
  
  paddingHorizontalMd: {
    paddingHorizontal: SPACING.MD,
  },
  
  paddingVerticalMd: {
    paddingVertical: SPACING.MD,
  },
});

export default CommonStyles;
