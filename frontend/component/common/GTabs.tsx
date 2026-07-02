"use client";

import clsx from "clsx";
import { GButton } from "./GButton";
import { GTabItem, GTabsProps } from "./def/GTabs";

function getListClassName(
  direction: "H" | "V",
  variant: GTabsProps<string | number>["variant"],
  fullWidth?: boolean,
  className?: string,
) {
  return clsx(
    "flex",
    direction === "V" ? "flex-col gap-1" : "flex-row flex-wrap gap-2",
    variant === "underline" && direction === "H" && "border-b border-border",
    variant === "default" && direction === "H" && "border-b border-border",
    fullWidth && direction === "H" && "w-full",
    className,
  );
}

function getTabClassName<T extends string | number>(
  tab: GTabItem<T>,
  active: boolean,
  direction: "H" | "V",
  variant: GTabsProps<T>["variant"],
  fullWidth?: boolean,
  tabClassName?: string,
) {
  const base = clsx(
    "flex items-center gap-2 transition-all",
    fullWidth && (direction === "H" ? "flex-1 justify-center" : "w-full justify-start"),
    tabClassName,
  );

  switch (variant) {
    case "sidebar":
      return clsx(
        base,
        "px-3 py-2.5 rounded-xl font-medium text-sm",
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-text-secondary hover:bg-surface-alt hover:text-text",
      );
    case "underline":
      return clsx(
        base,
        "px-3 py-2 rounded-none border-b-2 font-medium",
        active
          ? "border-primary text-primary"
          : "border-transparent text-text-secondary hover:text-text hover:border-border",
      );
    case "pills":
      return clsx(
        base,
        "px-4 py-2 rounded-xl font-medium",
        active
          ? "bg-primary text-white shadow-sm hover:bg-primary-hover"
          : "text-text-secondary hover:bg-primary/10",
      );
    default:
      return clsx(
        base,
        "px-3 py-2 rounded-md font-medium",
        active
          ? "bg-primary text-white hover:bg-primary-hover"
          : "text-text-secondary hover:bg-primary/10",
      );
  }
}

function GTabs<T extends string | number>({
  tabs,
  value,
  onChange,
  renderLabel,
  renderIcon,
  renderBadge,
  direction = "H",
  variant = direction === "V" ? "sidebar" : "default",
  className,
  tabClassName,
  fullWidth,
  children,
}: GTabsProps<T>) {
  return (
    <div className={fullWidth && direction === "V" ? "w-full" : undefined}>
      <div
        role="tablist"
        aria-orientation={direction === "V" ? "vertical" : "horizontal"}
        className={getListClassName(direction, variant, fullWidth, className)}
      >
        {tabs.map((tab) => {
          const active = value === tab.id;
          const labelContent = renderLabel?.(tab, active) ?? tab.label;
          const iconContent = renderIcon?.(tab, active) ?? tab.icon;
          const badgeContent =
            renderBadge?.(tab, active) ??
            (tab.badge != null && tab.badge > 0 ? (
              <span className="ms-auto text-xs bg-primary/20 px-2 py-0.5 rounded-full min-w-5 text-center">
                {tab.badge}
              </span>
            ) : null);

          return (
            <GButton
              key={String(tab.id)}
              role="tab"
              id={`tab-${String(tab.id)}`}
              aria-selected={active}
              aria-controls={`tabpanel-${String(tab.id)}`}
              tabIndex={active ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              variant="ghost"
              size={direction === "V" ? "md" : "sm"}
              className={getTabClassName(
                tab,
                active,
                direction,
                variant,
                fullWidth,
                tabClassName,
              )}
            >
              {iconContent}
              {labelContent}
              {badgeContent}
            </GButton>
          );
        })}
      </div>

      {children ? (
        <div
          role="tabpanel"
          id={`tabpanel-${String(value)}`}
          aria-labelledby={`tab-${String(value)}`}
          className="animate-fade-in"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export { GTabs };
