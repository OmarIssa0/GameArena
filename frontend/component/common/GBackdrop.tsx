"use client";

import clsx from "clsx";
import type { IGBackdropProps } from "./def/GBackdrop";

function GBackdrop({ onClick, className }: IGBackdropProps) {
  return <div className={clsx("fixed inset-0 z-backdrop bg-overlay/60", className)} onClick={onClick} aria-hidden />;
}

export { GBackdrop };
