import type { LucideIcon } from "lucide-react";

interface GDropdownItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

export type { GDropdownItemProps };
