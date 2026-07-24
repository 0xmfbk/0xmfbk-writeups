// src/hooks/useIsMobile.ts
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

function canUseDOM() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function";
}

export function useIsMobile() {
  // Returns false during SSR – no "undefined" flashes
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!canUseDOM()) return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Sync immediately (this is the only flash point, but it's minimal)
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
