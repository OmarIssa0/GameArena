import type { SizeEnum } from "@/domain/enum/SizeEnum";
import type { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import type { LucideIcon } from "lucide-react";
import type { MouseEvent } from "react";
interface GIconProps {
  icon: LucideIcon;
  size?: SizeEnum;
  color?: AccentColorEnum;
  flip?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  ariaLabel?: string;
  hover?: boolean;
  tile?: boolean;
  tileRounded?: SizeEnum;
  tileGradient?: string;
  tileColor?: AccentColorEnum;
  tileClassName?: string;
}
export type { GIconProps };
