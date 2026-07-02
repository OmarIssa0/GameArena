"use client";

import clsx from "clsx";
import { Loader2 } from "lucide-react";
import type { GSpinnerProps } from "./def/GSpinner";

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
} as const;

function GSpinner({ size = "md", className }: GSpinnerProps) {
  return (
    <Loader2
      className={clsx("animate-spin text-primary", sizeMap[size], className)}
    />
  );
}

export { GSpinner };
