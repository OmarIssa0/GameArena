import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AvatarShapeEnum } from "@/domain/enum/AvatarShapeEnum";
import type { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { TNullable } from "@/domain/type/TCommon";

export interface GAvatarProps {
  firstName?: TNullable<string>;
  lastName?: TNullable<string>;
  size?: SizeEnum;
  shape?: AvatarShapeEnum;
  status?: UserStatusEnum;
  className?: string;
}
