"use client";

import { useCallback, useEffect, useState } from "react";

export interface UseAsideReturn {
  collapsed: boolean;
  open: boolean;

  isDesktop: boolean;
  isCompact: boolean;
  isTablet: boolean;
  isMobile: boolean;

  expand: () => void;
  collapse: () => void;
  toggleCollapsed: () => void;

  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

const MOBILE_MAX = 639; // < 640px
const DESKTOP_MIN = 1024; // >= 1024px

export function useAside(defaultDesktopCollapsed = false): UseAsideReturn {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [collapsed, setCollapsed] = useState(defaultDesktopCollapsed);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mqMobile = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const mqDesktop = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);

    const update = () => {
      const next = mqDesktop.matches ? "desktop" : mqMobile.matches ? "mobile" : "tablet";

      setBreakpoint(next);

      if (next === "desktop") setOpen(false);
    };

    update();
    mqMobile.addEventListener("change", update);
    mqDesktop.addEventListener("change", update);
    return () => {
      mqMobile.removeEventListener("change", update);
      mqDesktop.removeEventListener("change", update);
    };
  }, []);

  const isDesktop = breakpoint === "desktop";
  const isTablet = breakpoint === "tablet";
  const isMobile = breakpoint === "mobile";
  const isCompact = !isDesktop;

  const expand = useCallback(() => setCollapsed(false), []);
  const collapse = useCallback(() => setCollapsed(true), []);
  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);

  const openMobile = useCallback(() => setOpen(true), []);
  const closeMobile = useCallback(() => setOpen(false), []);
  const toggleMobile = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    if (!open || isDesktop) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, isDesktop, closeMobile]);

  return {
    collapsed,
    open,
    isDesktop,
    isCompact,
    isTablet,
    isMobile,
    expand,
    collapse,
    toggleCollapsed,
    openMobile,
    closeMobile,
    toggleMobile,
  };
}
