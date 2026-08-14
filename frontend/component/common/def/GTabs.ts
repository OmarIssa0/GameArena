import type { ReactNode } from "react";

interface GTabItem<T extends string | number = string> {
  id: T;
  label?: ReactNode;
  icon?: ReactNode;
  badge?: number;
  disabled?: boolean;
}

interface GTabsProps<T extends string | number> {
  tabs: GTabItem<T>[];
  value: T;
  onChange: (tabId: T) => void;
  className?: string;
  tabClassName?: string;
  fullWidth?: boolean;
  /** Vertical (stacked) on mobile, horizontal on md+ */
  responsive?: boolean;
  renderLabel?: (tab: GTabItem<T>, active: boolean) => ReactNode;
  renderIcon?: (tab: GTabItem<T>, active: boolean) => ReactNode;
  renderBadge?: (tab: GTabItem<T>, active: boolean) => ReactNode;
  children?: ReactNode;
}

export type { GTabItem, GTabsProps };