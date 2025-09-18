/**
 * Custom hook for responsive breakpoint detection
 * Uses Ant Design's Grid.useBreakpoint() under the hood
 */

import { Grid } from 'antd';

export const useResponsive = () => {
  const screens = Grid.useBreakpoint();

  return {
    // Individual breakpoints
    xs: screens.xs,
    sm: screens.sm,
    md: screens.md,
    lg: screens.lg,
    xl: screens.xl,
    xxl: screens.xxl,

    // Convenience flags
    isMobile: !screens.md, // Mobile: xs and sm
    isTablet: screens.md && !screens.lg, // Tablet: md only
    isDesktop: screens.lg, // Desktop: lg and above

    // Screen size categories
    isSmallScreen: !screens.lg, // xs, sm, md
    isLargeScreen: screens.xl, // xl and above

    // All screens object for advanced usage
    screens,
  };
};
