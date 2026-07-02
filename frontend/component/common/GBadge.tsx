"use client";

import clsx from "clsx";
import type { GBadgeProps } from "./def/GBadge";

function GBadge({
  count = 0,
  className,
  max = 99,
  showZero = false,
  children,
}: GBadgeProps) {
  if (!showZero && count <= 0 && !children) return null;

  const label = children ?? (count > max ? `${max}+` : count.toString());

  return (
    <span
      className={clsx(
        "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
        "bg-error text-text shadow-sm shadow-error/25",
        className,
      )}
    >
      {label}
    </span>
  );
}

export { GBadge };
