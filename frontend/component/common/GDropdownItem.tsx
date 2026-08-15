"use client";

import clsx from "clsx";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { GButton } from "./GButton";
import { GIcon } from "./GIcon";
import type { IGDropdownItemProps } from "./def/GDropdownItem";

function GDropdownItem({ icon: Icon, label, onClick, className }: IGDropdownItemProps) {
  return (
    <GButton
      variant={ButtonVariantEnum.Subtle}
      size={SizeEnum.md}
      align="start"
      role="menuitem"
      className={clsx("gap-3 w-full", className)}
      onClick={onClick}>
      <GIcon icon={Icon} size={SizeEnum.sm} className="shrink-0" />
      <span className="truncate font-medium">{label}</span>
    </GButton>
  );
}

export { GDropdownItem };
