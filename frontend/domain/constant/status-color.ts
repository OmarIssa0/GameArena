import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { THashMap } from "@/domain/type/TCommon";

const statusColor: THashMap<string> = {
  [UserStatusEnum.Online]: "bg-success",
  [UserStatusEnum.InGame]: "bg-danger",
  [UserStatusEnum.Offline]: "bg-warning",
  [UserStatusEnum.All]: "bg-text-muted",
};

const statusColorText: THashMap<string> = {
  [UserStatusEnum.Online]: "text-success",
  [UserStatusEnum.InGame]: "text-danger",
  [UserStatusEnum.Offline]: "text-warning",
  [UserStatusEnum.All]: "text-text-muted",
};

export { statusColor, statusColorText };
