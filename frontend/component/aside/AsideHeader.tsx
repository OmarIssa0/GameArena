"use client";

import clsx from "clsx";
import { X, PanelLeftClose } from "lucide-react";

import { GButton } from "../common/GButton";
import { GIcon } from "../common/GIcon";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { IAsideHeaderProps } from "./def/AsideHeader";

function AsideHeader({ collapsed, expand, collapse, closeMobile, brand, collapsedIcon, label, actions, overlay = false }: IAsideHeaderProps) {
  if (overlay) {
    return (
      <header className="flex min-h-16 w-full shrink-0 items-center gap-2 border-b border-border px-3">
        <div className="min-w-0 flex-1">{brand}</div>
        <GButton
          variant={ButtonVariantEnum.Subtle}
          size={SizeEnum.icon}
          rounded={SizeEnum.full}
          onClick={closeMobile}
          aria-label={`Close ${label}`}
          title={`Close ${label}`}>
          <GIcon icon={X} size={SizeEnum.md} />
        </GButton>
        {actions}
      </header>
    );
  }

  return (
    <header className={clsx("flex min-h-16 w-full shrink-0 items-center gap-2 border-b border-border px-3", collapsed && "justify-center")}>
      {collapsed ? (
        <GButton
          variant={ButtonVariantEnum.Subtle}
          size={SizeEnum.icon}
          rounded={SizeEnum.full}
          onClick={expand}
          aria-label={`Expand ${label}`}
          title={label}>
          {collapsedIcon}
        </GButton>
      ) : (
        <div className="min-w-0 flex-1">{brand}</div>
      )}

      {!collapsed && (
        <GButton
          variant={ButtonVariantEnum.Subtle}
          size={SizeEnum.icon}
          rounded={SizeEnum.full}
          onClick={collapse}
          aria-label={`Collapse ${label}`}
          title={label}>
          <GIcon icon={PanelLeftClose} size={SizeEnum.sm} />
        </GButton>
      )}

      {actions}
    </header>
  );
}

export { AsideHeader };
