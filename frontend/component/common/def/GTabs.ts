import type { ReactNode } from "react";
import type { TabsDirectionEnum } from "@/domain/enum/TabsDirectionEnum";
import type { TabsVariantEnum } from "@/domain/enum/TabsVariantEnum";
import type { IndicatorPositionEnum } from "@/domain/enum/IndicatorPositionEnum";

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
  direction?: TabsDirectionEnum;
  variant?: TabsVariantEnum;
  className?: string;
  tabClassName?: string;
  fullWidth?: boolean;
  responsive?: boolean;
  indicator?: IndicatorPositionEnum;
  renderLabel?: (tab: GTabItem<T>, active: boolean) => ReactNode;
  renderIcon?: (tab: GTabItem<T>, active: boolean) => ReactNode;
  renderBadge?: (tab: GTabItem<T>, active: boolean) => ReactNode;
  children?: ReactNode;
}

export type { GTabItem, GTabsProps };