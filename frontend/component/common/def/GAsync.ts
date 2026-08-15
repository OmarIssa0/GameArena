import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import type { SizeEnum } from "@/domain/enum/SizeEnum";
import type { TNullable } from "@/domain/type/TCommon";

export interface IGAsyncProps {
  loading: boolean;
  error?: TNullable<string>;
  children?: ReactNode;
  spinnerSize?: SizeEnum;
  spinnerLabel?: string;
  errorTitle?: string;
  errorIcon?: LucideIcon;
  errorIconColor?: AccentColorEnum;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}