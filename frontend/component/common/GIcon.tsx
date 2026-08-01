"use client";

import clsx from "clsx";
import type { GIconProps } from "./def/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { IConSIZE } from "@/domain/constant/icon-size";

const toRounded = (r: SizeEnum) => (r === SizeEnum.None ? "rounded-none" : `rounded-${r}`);

const toHoverBg = (accent: AccentColorEnum) => (accent ? `hover:${accent.replace("text-", "bg-")}` : "");

const resolveTileBg = (gradient: string) =>
  gradient.startsWith("bg-") || gradient.startsWith("from-") ? gradient : `bg-${gradient.replace(/^text-/, "")}`;
function GIcon({
  icon: Icon,
  size = SizeEnum.md,
  color = AccentColorEnum.Inherit,
  flip = true,
  className,
  onClick,
  ariaLabel,
  tile = false,
  tileRounded = SizeEnum.md,
  tileGradient = "bg-primary",
  tileColor,
  tileClassName,
  hover = false,
}: GIconProps) {
  const iconSize = IConSIZE[size] as string;
  const isRtl = flip && "[dir=rtl]:scale-x-[-1]";
  if (!tile) {
    const iconEl = <Icon className={clsx("shrink-0", iconSize, color, isRtl, onClick && "cursor-pointer", className)} aria-hidden="true" />;
    return onClick ? (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={clsx(
          "inline-flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer rounded-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        )}>
        {iconEl}
      </button>
    ) : (
      iconEl
    );
  }
  const activeColor = tileColor || AccentColorEnum.OnPrimary;
  const iconEl = <Icon className={clsx(iconSize, activeColor, isRtl, "hover:text-text")} aria-hidden="true" />;
  const wrapperClasses = clsx(
    "inline-flex items-center justify-center shrink-0 p-2",
    toRounded(tileRounded),
    resolveTileBg(tileGradient),
    hover && toHoverBg(activeColor),
    onClick && `cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`,
    tileClassName,
  );

  return onClick ? (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={wrapperClasses}>
      {iconEl}
    </button>
  ) : (
    <div className={wrapperClasses} role={ariaLabel ? "img" : undefined} aria-label={ariaLabel}>
      {iconEl}
    </div>
  );
}

export { GIcon };
