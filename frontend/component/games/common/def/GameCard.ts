import type { LucideIcon } from "lucide-react";

export interface IGameCardProps {
  name: string;
  desc: string;
  icon?: LucideIcon;
  iconColor?: string;
  gradientClass?: string;
  animation?: string;
  onClick: () => void;
  playLabel: string;
  page?: boolean;
}
