"use client";

import clsx from "clsx";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { GStatusDotProps } from "./def/GStatusDot";

const statusColor: Record<UserStatusEnum, string> = {
  [UserStatusEnum.Offline]: "bg-text-muted",
  [UserStatusEnum.Online]: "bg-neon-green",
  [UserStatusEnum.InGame]: "bg-neon-cyan",
  [UserStatusEnum.All]: "bg-text-muted",
};

function GStatusDot({ status, className }: GStatusDotProps) {
  return (
    <span
      className={clsx(
        "status-dot",
        status !== undefined ? statusColor[status] : "bg-text-muted",
        className,
      )}
    />
  );
}

export { GStatusDot };
