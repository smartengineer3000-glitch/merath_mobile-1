/**
 * @file lib/design/theme.ts
 * @description World-class Material Design 3 theme system with light/dark mode
 * Professional design system for Merath calculator app
 * Includes: color palettes, typography, spacing, shadows, animations
 */

// ============================================================================
// COMPREHENSIVE COLOR PALETTE - Material Design 3
// ============================================================================

export const Colors = {
  // Primary Palette - Islamic Green (Trust, growth, nature)
  primary: {
    light: "#f0f9f6",
    lighter: "#d4f1e9",
    light50: "#a8e4d6",
    light100: "#7dd4be",
    light200: "#5cc9ac",
    main: "#2e7d32", // Primary color
    dark100: "#2d6b2a",
    dark200: "#2a5a23",
    dark300: "#27491d",
    dark: "#1f3817",
  },

  // Secondary Palette - Professional Blue (Calm, stability)
  secondary: {
    light: "#f0f5ff",
    lighter: "#d9eaff",
    light50: "#b3d5ff",
    light100: "#8dbfff",
    light200: "#67aaff",
    main: "#4f9eff", // Secondary color
    dark100: "#4680e6",
    dark200: "#3d62cd",
    dark300: "#3a59bd",
    dark: "#33439f",
  },

  // Tertiary Palette - Warm Gold (Energy, emphasis)
  tertiary: {
    light: "#fffbf0",
    lighter: "#ffe8cc",
    light50: "#ffd699",
    light100: "#ffc266",
    light200: "#ffb340",
    main: "#ffa500", // Tertiary color
    dark100: "#ff9500",
    dark200: "#ff8500",
    dark300: "#e67000",
    dark: "#b35900",
  },

  // Neutral Palette - Professional grays
  neutral: {
    white: "#ffffff",
    light50: "#f9fafb",
    light100: "#f3f4f6",
    light200: "#e5e7eb",
    light300: "#d1d5db",
    light400: "#9ca3af",
    main: "#6b7280",
    dark100: "#4b5563",
    dark200: "#374151",
    dark300: "#1f2937",
    black: "#111827",
  },

  // Background & Surface colors
  background: {
    light: "#ffffff",
    lightVariant: "#f9fafb",
    dark: "#0f1419",
    darkVariant: "#1a1f2e",
  },

  // Semantic colors
  success: {
    light: "#e8f5e9",
    main: "#4caf50",
    dark: "#2e7d32",
  },
  warning: {
    light: "#fff3e0",
    main: "#ff9800",
    dark: "#e65100",
  },
  error: {
    light: "#ffebee",
    main: "#f44336",
    dark: "#d32f2f",
  },
  info: {
    light: "#e3f2fd",
    main: "#2196f3",
    dark: "#0d47a1",
  },
};

// ============================================================================
// TYPOGRAPHY SYSTEM - Professional hierarchy
// ============================================================================

export const Typography = {
  // Display - Large prominent headlines
  display: {
    large: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: "700" as const,
      letterSpacing: 0,
    },
    medium: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: "700" as const,
      letterSpacing: 0,
    },
    small: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: "700" as const,
      letterSpacing: 0,
    },
  },

  // Headline - Section headings
  headline: {
    large: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: "700" as const,
      letterSpacing: 0,
    },
    medium: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: "700" as const,
      letterSpacing: 0,
    },
    small: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "700" as const,
      letterSpacing: 0,
    },
  },

  // Title - Component titles
  title: {
    large: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "700" as const,
      letterSpacing: 0.15,
    },
    medium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "600" as const,
      letterSpacing: 0.1,
    },
    small: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "600" as const,
      letterSpacing: 0.1,
    },
  },

  // Body - Main content text
  body: {
    large: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "400" as const,
      letterSpacing: 0.5,
    },
    medium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "400" as const,
      letterSpacing: 0.25,
    },
    small: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "400" as const,
      letterSpacing: 0.4,
    },
  },

  // Label - Buttons, labels, small text
  label: {
    large: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "500" as const,
      letterSpacing: 0.1,
    },
    medium: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "500" as const,
      letterSpacing: 0.5,
    },
    small: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: "500" as const,
      letterSpacing: 0.5,
    },
  },
};

// ============================================================================
// SPACING SYSTEM - 8pt base grid
// ============================================================================

export const Spacing = {
  xs: 4, // 4px
  sm: 8, // 8px
  md: 12, // 12px
  lg: 16, // 16px
  xl: 24, // 24px
  xxl: 32, // 32px
  xxxl: 48, // 48px
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// ============================================================================
// SHADOWS
// ============================================================================

export const Shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ============================================================================
// ANIMATIONS - Transition timings
// ============================================================================

export const Animations = {
  quick: 150, // Quick interactions
  standard: 300, // Standard animations
  slow: 500, // Slower animations
};

// ============================================================================
// COMPONENT SPECIFICATIONS
// ============================================================================

export const Components = {
  button: {
    height: 44,
    minWidth: 120,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  input: {
    height: 44,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  card: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
};

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  primary: {
    light: string;
    lighter: string;
    light50: string;
    light100: string;
    light200: string;
    main: string;
    dark100: string;
    dark200: string;
    dark300: string;
    dark: string;
  };
  secondary: typeof Colors.secondary;
  tertiary: typeof Colors.tertiary;
  neutral: typeof Colors.neutral;
  background: typeof Colors.background;
  success: typeof Colors.success;
  warning: typeof Colors.warning;
  error: typeof Colors.error;
  info: typeof Colors.info;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: typeof Typography;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  shadows: typeof Shadows;
  animations: typeof Animations;
  components: typeof Components;
}

// ============================================================================
// LIGHT THEME
// ============================================================================

export const lightTheme: Theme = {
  mode: "light",
  colors: {
    ...Colors,
  } as ThemeColors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  animations: Animations,
  components: Components,
};

// ============================================================================
// DARK THEME COLORS
// ============================================================================

const DarkColors: ThemeColors = {
  primary: {
    light: "#1a3a1c",
    lighter: "#1e4d22",
    light50: "#256329",
    light100: "#2d7a30",
    light200: "#35913a",
    main: "#4CAF50",
    dark100: "#66BB6A",
    dark200: "#81C784",
    dark300: "#A5D6A7",
    dark: "#C8E6C9",
  },
  secondary: {
    light: "#1a2744",
    lighter: "#1e3355",
    light50: "#254066",
    light100: "#2d4d77",
    light200: "#3a5f8f",
    main: "#5C9FFF",
    dark100: "#7BB3FF",
    dark200: "#9AC7FF",
    dark300: "#A8CFFF",
    dark: "#C4DFFF",
  },
  tertiary: {
    light: "#332200",
    lighter: "#4d3300",
    light50: "#664400",
    light100: "#805500",
    light200: "#996600",
    main: "#FFB74D",
    dark100: "#FFC570",
    dark200: "#FFD494",
    dark300: "#FFDCA8",
    dark: "#FFE8C4",
  },
  neutral: {
    white: "#121212",
    light50: "#1a1a2e",
    light100: "#1e1e32",
    light200: "#2a2a3d",
    light300: "#3a3a4d",
    light400: "#8e8ea0",
    main: "#a0a0b0",
    dark100: "#c0c0d0",
    dark200: "#d0d0e0",
    dark300: "#e0e0f0",
    black: "#f0f0ff",
  },
  background: {
    light: "#121212",
    lightVariant: "#1a1a2e",
    dark: "#f9fafb",
    darkVariant: "#f3f4f6",
  },
  success: {
    light: "#1a3a1c",
    main: "#66BB6A",
    dark: "#A5D6A7",
  },
  warning: {
    light: "#332200",
    main: "#FFB74D",
    dark: "#FFD494",
  },
  error: {
    light: "#3a1a1a",
    main: "#EF5350",
    dark: "#E57373",
  },
  info: {
    light: "#1a2744",
    main: "#42A5F5",
    dark: "#90CAF9",
  },
};

// ============================================================================
// DARK THEME
// ============================================================================

export const darkTheme: Theme = {
  mode: "dark",
  colors: DarkColors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  animations: Animations,
  components: Components,
};
