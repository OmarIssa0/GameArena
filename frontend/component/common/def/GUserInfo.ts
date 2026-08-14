import type { SizeEnum } from "@/domain/enum/SizeEnum";
import type { UserStatusEnum } from "@/domain/enum/UserStatusEnum";

interface GUserInfoProps {
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  status?: UserStatusEnum;
  avatarSize?: SizeEnum;
  className?: string;
}

export type { GUserInfoProps };