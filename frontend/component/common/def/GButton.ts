import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

interface GButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: AccentColorEnum;
  size?: SizeEnum;
  rounded?: SizeEnum;
  loadingText?: string;
  fullWidth?: boolean;
}

export type { GButtonProps };
