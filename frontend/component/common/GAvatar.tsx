"use client";

import clsx from "clsx";

import { squareSize } from "@/domain/constant/square-size";
import { statusColor } from "@/domain/constant/status-color";
import type { GAvatarProps } from "./def/GAvatar";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AvatarShapeEnum } from "@/domain/enum/AvatarShapeEnum";

function GAvatar({ firstName, lastName, size = SizeEnum.xs, shape = AvatarShapeEnum.Circle, status = UserStatusEnum.All, className }: GAvatarProps) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const avatarClassName = clsx(
    "flex shrink-0 items-center justify-center overflow-hidden bg-primary font-bold text-text",
    squareSize[size],
    shape === AvatarShapeEnum.Circle ? "rounded-full" : "rounded-[var(--radius-md)]",
  );

  return (
    <div className={clsx("relative inline-flex shrink-0", className)}>
      <div className={avatarClassName}>{initials}</div>

      {status !== UserStatusEnum.All && (
        <span className={clsx("absolute bottom-0 inset-e-0 size-2.5 rounded-full border-2 border-bg", statusColor[status])} />
      )}
    </div>
  );
}

export { GAvatar };