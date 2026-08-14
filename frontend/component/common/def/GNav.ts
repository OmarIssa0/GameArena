import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { IndicatorPositionEnum } from "@/domain/enum/IndicatorPositionEnum";
import type { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";

interface GNavItem {
  id: string;
  label?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface GNavProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  items: GNavItem[];
  orientation?: NavOrientationEnum;
  indicator?: IndicatorPositionEnum;
  collapsed?: boolean;
  stacked?: boolean;
  /** Horizontal (pills) on mobile, vertical (sidebar shape) on md+ */
  responsive?: boolean;
  /** Inverted responsive: vertical (sidebar shape) on mobile, horizontal (pills) on md+ */
  responsiveInverted?: boolean;
  className?: string;
}

export type { GNavProps, GNavItem };
