import type { ButtonHTMLAttributes, ReactNode } from "react";
import { IndicatorPositionEnum } from "@/domain/enum/IndicatorPositionEnum";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";

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
  className?: string;
}

export type { GNavProps, GNavItem };