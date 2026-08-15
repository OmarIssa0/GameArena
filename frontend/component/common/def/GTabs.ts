import type { ReactNode } from "react";

interface IGTabItem<T extends string | number = string> {
  id: T;
  label?: ReactNode;
  icon?: ReactNode;
  badge?: number;
  disabled?: boolean;
}

interface IGTabsProps<T extends string | number> {
  tabs: IGTabItem<T>[];
  value: T;
  onChange: (tabId: T) => void;
  className?: string;
  tabClassName?: string;
  fullWidth?: boolean;
  responsive?: boolean;
  renderLabel?: (tab: IGTabItem<T>, active: boolean) => ReactNode;
  renderIcon?: (tab: IGTabItem<T>, active: boolean) => ReactNode;
  renderBadge?: (tab: IGTabItem<T>, active: boolean) => ReactNode;
  children?: ReactNode;
}

export type { IGTabItem, IGTabsProps };
