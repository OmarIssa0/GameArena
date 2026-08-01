import type { HTMLAttributes, ReactNode } from "react";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

interface GBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: AccentColorEnum;
  size?: SizeEnum;
  children: ReactNode;
}

export type { GBadgeProps };
