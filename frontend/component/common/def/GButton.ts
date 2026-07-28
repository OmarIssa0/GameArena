import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "link" | "outline-danger";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon";
  rounded?: "sm" | "md" | "lg" | "full";
  loadingText?: string;
  fullWidth?: boolean;
}

export type { GButtonProps };
