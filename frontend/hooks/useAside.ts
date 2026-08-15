"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sidebar-collapsed";

export interface UseAsideReturn {
  collapsed: boolean;
  open: boolean;

  expand: () => void;
  collapse: () => void;
  toggleCollapsed: () => void;

  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

function getInitialCollapsed(defaultDesktopCollapsed: boolean): boolean {
  if (typeof window === "undefined") return defaultDesktopCollapsed;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) return defaultDesktopCollapsed;
  return stored === "true";
}

export function useAside(defaultDesktopCollapsed = false): UseAsideReturn {
  const [collapsed, setCollapsed] = useState(() => getInitialCollapsed(defaultDesktopCollapsed));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  const expand = () => setCollapsed(false);
  const collapse = () => setCollapsed(true);
  const toggleCollapsed = () => setCollapsed((c) => !c);

  const openMobile = () => setOpen(true);
  const closeMobile = () => setOpen(false);
  const toggleMobile = () => setOpen((o) => !o);

  return {
    collapsed,
    open,
    expand,
    collapse,
    toggleCollapsed,
    openMobile,
    closeMobile,
    toggleMobile,
  };
}
