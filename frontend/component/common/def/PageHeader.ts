import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface IPageHeaderProps {
  icon: LucideIcon;
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  className?: string;
}
