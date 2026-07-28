import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { THashMap } from "@/domain/type/TCommon";

const statusColor: THashMap<string> = {
  [UserStatusEnum.Online]: "bg-success",
  [UserStatusEnum.InGame]: "bg-danger",
  [UserStatusEnum.Offline]: "bg-warning",
  [UserStatusEnum.All]: "bg-text-muted",
};
export { statusColor };
