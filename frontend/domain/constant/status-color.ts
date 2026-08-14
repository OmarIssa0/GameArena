import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

const statusColor: Record<UserStatusEnum, string> = {
  [UserStatusEnum.Online]: "bg-success",
  [UserStatusEnum.InGame]: "bg-danger",
  [UserStatusEnum.Offline]: "bg-warning",
  [UserStatusEnum.All]: "bg-text-muted",
};

const statusColorText: Record<UserStatusEnum, string> = {
  [UserStatusEnum.Online]: AccentColorEnum.Success,
  [UserStatusEnum.InGame]: AccentColorEnum.Danger,
  [UserStatusEnum.Offline]: AccentColorEnum.Warning,
  [UserStatusEnum.All]: AccentColorEnum.Muted,
};

export { statusColor, statusColorText };
