import type { ButtonHTMLAttributes, ReactNode } from "react";

type GButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type GButtonSize = "sm" | "md" | "lg" | "icon";

interface GButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: GButtonVariant;
  size?: GButtonSize;
  loadingText?: string;
  fullWidth?: boolean;
}

export type { GButtonProps, GButtonVariant, GButtonSize };
