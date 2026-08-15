import type { ReactNode } from "react";
import type { UserStatusEnum } from "@/domain/enum/UserStatusEnum";

interface ISocialListItemProps {
  firstName: string | null;
  lastName: string | null;
  userName?: string | null;
  status?: UserStatusEnum;
  badge?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export type { ISocialListItemProps };
