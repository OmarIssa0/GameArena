import type { HTMLAttributes, ReactNode } from "react";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

export type GModalSide = "center" | "start" | "end" | "bottom";

interface GModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  size?: SizeEnum;
  cardPadding?: SizeEnum;
  /** "center" renders a centered dialog; others render a fixed side/bottom sheet panel */
  side?: GModalSide;
  panelClassName?: string;
  role?: "dialog" | "alertdialog";
  ariaLabel?: string;
  ariaDescription?: string;
}

export type { GModalProps };