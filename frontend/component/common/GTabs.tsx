"use client";

import clsx from "clsx";
import { GBadge } from "./GBadge";
import type { GTabsProps } from "./def/GTabs";
import { TabsDirectionEnum } from "@/domain/enum/TabsDirectionEnum";
import { TabsVariantEnum } from "@/domain/enum/TabsVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

const variantStyles: Record<
  TabsVariantEnum,
  {
    tab: string;
    active: string;
    idle: string;
    list?: string;
  }
> = {
  [TabsVariantEnum.Pills]: {
    tab: "px-4 py-2 rounded-md text-sm font-medium",
    active: "bg-primary text-on-primary",
    idle: "text-text-secondary hover:bg-primary-muted hover:text-text",
  },
  [TabsVariantEnum.Underline]: {
    tab: "px-3 py-2.5 text-sm font-medium border-b-2 -mb-px",
    active: "text-primary border-b-primary",
    idle: "text-text-secondary hover:text-text border-b-transparent",
    list: "border-b border-border",
  },
  [TabsVariantEnum.Sidebar]: {
    tab: "px-3 py-2.5 text-sm font-medium border-s-[3px]",
    active: "bg-primary-muted text-primary font-semibold border-s-primary",
    idle: "text-text-secondary hover:bg-primary-muted hover:text-text border-s-transparent",
  },
  [TabsVariantEnum.Default]: {
    tab: "px-4 py-2 rounded-md text-sm font-medium",
    active: "bg-primary text-on-primary",
    idle: "text-text-secondary hover:bg-primary-muted hover:text-text",
  },
};

function renderTabBadge<T extends string | number>(tab: { id: T; badge?: number }, renderBadge: GTabsProps<T>["renderBadge"], active: boolean) {
  if (renderBadge) {
    return renderBadge(tab, active);
  }

  if (tab.badge == null || tab.badge <= 0) {
    return null;
  }

  return (
    <GBadge size={SizeEnum.sm} className="ms-auto min-w-5 justify-center">
      {tab.badge}
    </GBadge>
  );
}

function GTabs<T extends string | number>({
  tabs,
  value,
  onChange,
  renderLabel,
  renderIcon,
  renderBadge,
  direction = TabsDirectionEnum.H,
  variant = direction === TabsDirectionEnum.V ? TabsVariantEnum.Sidebar : TabsVariantEnum.Default,
  responsive = false,
  className,
  tabClassName,
  fullWidth,
  children,
}: GTabsProps<T>) {
  const styles = variantStyles[variant] ?? variantStyles[TabsVariantEnum.Default];

  const isVertical = direction === TabsDirectionEnum.V;
  const isSidebar = variant === TabsVariantEnum.Sidebar && isVertical;

  // Responsive: H becomes V on sm/md screens (lg+ stays horizontal)
  // Responsive: V becomes H on md+ screens (stays vertical below md)
  const responsiveH = !isVertical && responsive;

  const flexClasses = isVertical
    ? responsive
      ? "flex-col gap-1 md:flex-row md:flex-wrap"
      : "flex-col gap-1"
    : responsiveH
      ? "flex-col gap-1 lg:flex-row lg:flex-wrap"
      : "flex-row flex-wrap gap-1";

  // For responsive H→V, also treat as "effectively vertical" on small screens
  // so sidebar variant and fullWidth logic can adapt
  const effectiveVertical = isVertical || responsiveH;

  return (
    <div className={fullWidth && effectiveVertical ? "w-full" : undefined}>
      <nav
        role="tablist"
        aria-orientation={isVertical ? "vertical" : "horizontal"}
        className={clsx("flex", flexClasses, styles.list, fullWidth && !isVertical && "w-full", className)}>
        {tabs.map((tab) => {
          const active = value === tab.id;

          return (
            <button
              key={String(tab.id)}
              type="button"
              role="tab"
              id={`tab-${String(tab.id)}`}
              aria-selected={active}
              aria-controls={`tabpanel-${String(tab.id)}`}
              tabIndex={active ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={clsx(
                "flex items-center min-w-0 gap-2 transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                styles.tab,
                active ? styles.active : styles.idle,

                // Sidebar label layout
                isSidebar && "gap-3 md:gap-2",

                isSidebar && "md:flex-1 md:justify-center",

                // Full-width horizontal tabs (not responsive-vertical)
                fullWidth && !effectiveVertical && "flex-1 justify-center",

                // Full-width responsive vertical tabs
                fullWidth && responsiveH && "w-full lg:flex-1 lg:justify-center",

                tabClassName,
              )}>
              {renderIcon ? renderIcon(tab, active) : tab.icon}

              <span className={clsx(isSidebar && "min-w-0 flex-1 text-start leading-snug whitespace-normal md:flex-none md:text-center")}>
                {renderLabel ? renderLabel(tab, active) : tab.label}
              </span>

              {renderTabBadge(tab, renderBadge, active)}
            </button>
          );
        })}
      </nav>

      {children && (
        <div role="tabpanel" id={`tabpanel-${String(value)}`} aria-labelledby={`tab-${String(value)}`} className="pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

export { GTabs };
