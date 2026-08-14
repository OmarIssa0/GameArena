"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { GBackdrop } from "./GBackdrop";

const MENU_WIDTH = 208; // w-52 (13rem)

interface GDropdownProps {
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
}

function GDropdown({ open, onClose, trigger, children, align = "end", className }: GDropdownProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasOpenedRef = useRef(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const getMenuItems = useCallback(
    () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []),
    [],
  );

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const rtl = typeof document !== "undefined" && document.documentElement.dir === "rtl";

    // Logical start/end: in RTL the mirror is reversed geometrically.
    const endX = rtl ? rect.left : rect.right - MENU_WIDTH;
    const startX = rtl ? rect.right - MENU_WIDTH : rect.left;
    const x = Math.max(4, Math.min(align === "end" ? endX : startX, window.innerWidth - MENU_WIDTH - 4));

    setPosition({ x, y: rect.bottom + 6 });
  }, [align]);

  useEffect(() => {
    if (!open) return;

    hasOpenedRef.current = true;
    updatePosition();

    const raf = requestAnimationFrame(() => {
      getMenuItems()[0]?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") return;

      e.preventDefault();
      const items = getMenuItems();
      if (items.length === 0) return;

      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      let nextIndex: number;
      if (e.key === "Home") nextIndex = 0;
      else if (e.key === "End") nextIndex = items.length - 1;
      else if (e.key === "ArrowDown") nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
      else nextIndex = currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;

      items[nextIndex].focus();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, updatePosition, getMenuItems]);

  // Restore focus to the trigger once the menu closes (after the first open).
  useEffect(() => {
    if (open) return;
    if (!hasOpenedRef.current) return;
    triggerRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [open]);

  return (
    <>
      <div ref={triggerRef} className="inline-flex">
        {trigger}
      </div>

      {open &&
        position &&
        createPortal(
          <>
            <GBackdrop onClick={onClose} />
            <div
              ref={menuRef}
              role="menu"
              aria-orientation="vertical"
              className={clsx(
                "fixed z-popover w-52 overflow-hidden rounded-xl border border-border bg-bg-card shadow-lg",
                className,
              )}
              style={{ left: position.x, top: position.y }}>
              {children}
            </div>
          </>,
          document.body,
        )}
    </>
  );
}

export { GDropdown };
