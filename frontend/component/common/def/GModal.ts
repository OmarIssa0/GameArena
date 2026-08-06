import type { HTMLAttributes, ReactNode } from "react";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

interface GModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  size?: SizeEnum;
  cardPadding?: SizeEnum;
  role?: "dialog" | "alertdialog";
  ariaLabel?: string;
  ariaDescription?: string;
}

export type { GModalProps };
