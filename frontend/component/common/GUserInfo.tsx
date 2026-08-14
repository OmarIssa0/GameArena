"use client";

import clsx from "clsx";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { GAvatar } from "./GAvatar";
import type { GUserInfoProps } from "./def/GUserInfo";

function GUserInfo({ firstName, lastName, userName, status, avatarSize = SizeEnum.sm, className }: GUserInfoProps) {
  return (
    <div className={clsx("flex items-center gap-3 min-w-0", className)}>
      <GAvatar firstName={firstName} lastName={lastName} status={status} size={avatarSize} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text">
          {firstName} {lastName}
        </p>
        {userName && <p className="truncate text-xs text-text-secondary">@{userName}</p>}
      </div>
    </div>
  );
}

export { GUserInfo };