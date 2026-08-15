import type { HTMLAttributes, ReactNode } from "react";
import type { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

interface IGBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: AccentColorEnum;
  size?: SizeEnum;
  children: ReactNode;
}

export type { IGBadgeProps };
