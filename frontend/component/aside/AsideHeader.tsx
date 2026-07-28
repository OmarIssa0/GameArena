"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import { GButton } from "../common/GButton";
import type { AsideState } from "./AsideTypes";

interface AsideHeaderProps {
  aside: AsideState;
  /** Brand content shown when expanded (or mobile) */
  brand: React.ReactNode;
  /** Collapsed icon shown when desktop-collapsed */
  collapsedIcon: React.ReactNode;
  /** Accessible label prefix */
  label: string;
  /** Extra header actions (e.g. close button, collapse button) */
  actions?: React.ReactNode;
}

/**
 * Shared header for aside panels (Sidebar / SocialPanel).
 *
 * Handles three states:
 * 1. Desktop + collapsed → shows collapsedIcon + expand button
 * 2. Desktop + expanded → shows brand + collapse button + optional actions
 * 3. Mobile overlay → shows brand + close button
 */
function AsideHeader({ aside, brand, collapsedIcon, label, actions }: AsideHeaderProps) {
  const { collapsed, isDesktop, open, expand, collapse, closeMobile } = aside;

  const isInlineDesktop = isDesktop;
  const isOverlay = !isInlineDesktop;

  const content = useMemo(() => {
    // Desktop collapsed: show collapsed icon with expand button
    if (collapsed && isInlineDesktop) {
      return (
        <GButton variant="ghost" size="icon" onClick={expand} aria-label={`Expand ${label}`}>
          {collapsedIcon}
        </GButton>
      );
    }

    // Default: show brand
    return <div className="flex-1 min-w-0 flex items-center gap-3">{brand}</div>;
  }, [collapsed, isInlineDesktop, expand, collapsedIcon, brand, label]);

  return (
    <header className="h-20 shrink-0 border-b border-border flex items-center px-4">
      <div className={clsx("flex items-center w-full gap-2", collapsed && isInlineDesktop && "justify-center")}>
        {content}

        {/* Desktop expanded: collapse button */}
        {isInlineDesktop && !collapsed && (
          <GButton variant="ghost" size="icon" onClick={collapse} className="ms-auto" aria-label={`Collapse ${label}`}>
            <X size={18} />
          </GButton>
        )}

        {/* Mobile overlay: close button */}
        {isOverlay && open && (
          <GButton variant="ghost" size="icon" onClick={closeMobile} className="ms-auto" aria-label={`Close ${label}`}>
            <X size={20} />
          </GButton>
        )}

        {actions}
      </div>
    </header>
  );
}

export { AsideHeader };
export type { AsideHeaderProps };
