/* eslint-disable @next/next/no-img-element */
"use client";

import clsx from "clsx";
import type { GAvatarProps } from "./def/GAvatar";

const sizeMap = {
  sm: "w-10 h-10 min-w-10 rounded-xl text-sm",
  md: "w-16 h-16 min-w-16 rounded-xl text-lg",
  lg: "w-20 h-20 min-w-20 rounded-xl text-2xl",
} as const;

function GAvatar({ firstName, lastName, userName, src, size = "sm", className }: GAvatarProps) {
  const initials = ((firstName?.charAt(0) ?? "") + (lastName?.charAt(0) ?? "")).toUpperCase() || userName?.charAt(0).toUpperCase() || "?";

  if (src) {
    return (
      <div className={clsx("relative shrink-0", className)}>
        <img
          src={src}
          alt=""
          className={clsx("object-cover", sizeMap[size])}
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center bg-linear-to-br from-primary/20 to-neon-cyan/20 font-bold text-text",
        sizeMap[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}

export { GAvatar };
