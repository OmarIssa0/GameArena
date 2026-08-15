import type { LucideIcon } from "lucide-react";

interface IGDropdownItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

export type { IGDropdownItemProps };
