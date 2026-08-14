import type { SizeEnum } from "@/domain/enum/SizeEnum";
import type { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { TNullable } from "@/domain/type/TCommon";

export interface GAvatarProps {
  firstName?: TNullable<string>;
  lastName?: TNullable<string>;
  size?: SizeEnum;
  status?: UserStatusEnum;
  className?: string;
}
