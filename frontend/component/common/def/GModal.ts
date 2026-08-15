import type { HTMLAttributes, ReactNode } from "react";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

export type GModalSide = "center" | "start" | "end" | "bottom";

interface IGModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  size?: SizeEnum;
  cardPadding?: SizeEnum;
  side?: GModalSide;
  panelClassName?: string;
  role?: "dialog" | "alertdialog";
  ariaLabel?: string;
  ariaDescription?: string;
}

export type { IGModalProps };
