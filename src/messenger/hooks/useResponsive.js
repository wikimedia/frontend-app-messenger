// hooks/useResponsive.js
import { breakpoints, useWindowSize } from '@openedx/paragon';

export function useIsOnDesktop() {
  const windowSize = useWindowSize();
  return windowSize.width >= breakpoints.medium.minWidth;
}

export function useIsOnMobile() {
  const windowSize = useWindowSize();
  return windowSize.width < breakpoints.medium.minWidth;
}
