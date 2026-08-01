"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import { GButton } from "../common/GButton";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { IAsideHeaderProps } from "./def/AsideHeader";

function AsideHeader({ aside, brand, collapsedIcon, label, actions }: IAsideHeaderProps) {
  const { collapsed, isDesktop, open, expand, collapse, closeMobile } = aside;

  const isInlineDesktop = isDesktop;
  const isOverlay = !isInlineDesktop;

  const content = useMemo(() => {
    if (collapsed && isInlineDesktop) {
      return (
        <GButton variant={AccentColorEnum.Muted} size={SizeEnum.icon} onClick={expand} aria-label={`Expand ${label}`}>
          {collapsedIcon}
        </GButton>
      );
    }

    return <div className="flex-1 min-w-0 flex items-center gap-3">{brand}</div>;
  }, [collapsed, isInlineDesktop, expand, collapsedIcon, brand, label]);

  return (
    <header className="h-20 shrink-0 border-b border-border flex items-center px-4">
      <div className={clsx("flex items-center w-full gap-2", collapsed && isInlineDesktop && "justify-center")}>
        {content}

        {isInlineDesktop && !collapsed && (
          <GButton variant={AccentColorEnum.Muted} size={SizeEnum.icon} onClick={collapse} className="ms-auto" aria-label={`Collapse ${label}`}>
            <X size={18} />
          </GButton>
        )}

        {isOverlay && open && (
          <GButton variant={AccentColorEnum.Muted} size={SizeEnum.icon} onClick={closeMobile} className="ms-auto" aria-label={`Close ${label}`}>
            <X size={20} />
          </GButton>
        )}

        {actions}
      </div>
    </header>
  );
}

export { AsideHeader };
