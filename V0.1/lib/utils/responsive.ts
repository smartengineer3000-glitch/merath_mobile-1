import { Dimensions, PixelRatio, Platform } from "react-native";

export type Breakpoint = "sm" | "md" | "lg" | "xl";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const BREAKPOINTS = {
  sm: 360,
  md: 410,
  lg: 600,
} as const;

const scale = SCREEN_WIDTH / 390;

export function getBreakpoint(width = SCREEN_WIDTH): Breakpoint {
  if (width < BREAKPOINTS.sm) return "sm";
  if (width < BREAKPOINTS.md) return "md";
  if (width < BREAKPOINTS.lg) return "lg";
  return "xl";
}

export const isNarrow = SCREEN_WIDTH < BREAKPOINTS.sm;
export const isTablet = SCREEN_WIDTH >= BREAKPOINTS.lg;

export function responsive<T>(
  values: Partial<Record<Breakpoint, T>> & { default: T },
  width = SCREEN_WIDTH,
): T {
  const breakpoint = getBreakpoint(width);
  return values[breakpoint] ?? values.default;
}

export function moderateScale(size: number, factor = 0.5): number {
  return size + (scale - 1) * size * factor;
}

export function useResponsive() {
  const width = SCREEN_WIDTH;
  const height = SCREEN_HEIGHT;
  const breakpoint = getBreakpoint(width);
  const isNarrow = width < BREAKPOINTS.sm;
  const isTablet = width >= BREAKPOINTS.lg;

  const spacing = (base: number) =>
    isTablet ? Math.round(base * 1.2) : isNarrow ? Math.round(base * 0.85) : base;

  const fontSize = (size: number) => moderateScale(size);

  return {
    width,
    height,
    breakpoint,
    isNarrow,
    isTablet,
    spacing,
    fontSize,
  };
}

export const MIN_TOUCH_TARGET = Platform.select({ web: 32, default: 44 });

export function ensureTouchTarget(size: number): number {
  return Math.max(size, MIN_TOUCH_TARGET);
}
