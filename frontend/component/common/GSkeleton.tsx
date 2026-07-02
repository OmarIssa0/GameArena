"use client";

import clsx from "clsx";
import type { GSkeletonProps } from "./def/GSkeleton";

function GSkeleton({ variant = "text", width, height, className }: GSkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-700",
        variant === "circle" && "rounded-full",
        variant === "rect" && "rounded-xl",
        variant === "text" && "h-4 rounded",
        className,
      )}
      style={{ width, height }}
    />
  );
}

export { GSkeleton };
