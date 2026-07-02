import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { THashMap } from "@/domain/type/TCommon";

const cn = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(" ");
};

const statusColor: THashMap<string> = {
  [UserStatusEnum.Offline]: "text-text-muted",
  [UserStatusEnum.Online]: "text-neon-green",
  [UserStatusEnum.InGame]: "text-neon-cyan",
};

const statusBgColor: THashMap<string> = {
  [UserStatusEnum.Offline]: "bg-text-muted",
  [UserStatusEnum.Online]: "bg-neon-green shadow-[0_0_5px_rgba(0,229,160,0.5)]",
  [UserStatusEnum.InGame]: "bg-neon-cyan shadow-[0_0_5px_rgba(0,210,255,0.5)]",
};

export { cn, statusColor, statusBgColor };
