import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

interface GButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: ButtonVariantEnum;
  size?: SizeEnum;
  rounded?: SizeEnum;
  /** Content alignment. Defaults to "center". */
  align?: "start" | "center" | "end";
  loadingText?: string;
  fullWidth?: boolean;
}

export type { GButtonProps };
