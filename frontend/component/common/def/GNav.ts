import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { IndicatorPositionEnum } from "@/domain/enum/IndicatorPositionEnum";
import type { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";

interface IGNavItem {
  id: string;
  label?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface IGNavProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  items: IGNavItem[];
  orientation?: NavOrientationEnum;
  indicator?: IndicatorPositionEnum;
  collapsed?: boolean;
  stacked?: boolean;
  responsive?: boolean;
  responsiveInverted?: boolean;
  className?: string;
}

export type { IGNavProps, IGNavItem };
