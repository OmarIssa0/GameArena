"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { IndicatorPositionEnum } from "@/domain/enum/IndicatorPositionEnum";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";
import { navIndicator } from "@/domain/constant/nav-indicator";
import type { GNavProps } from "./def/GNav";

const navBase = {
  itemIdle: "text-text-secondary hover:bg-primary-muted hover:text-text",
  itemActive: "bg-primary-muted text-primary font-semibold",
};

const responsiveIndicator = {
  active: "border-t-[3px] border-t-primary md:border-t-0 md:border-s-[3px] md:border-s-primary",
  idle: "border-t-[3px] border-t-transparent md:border-t-0 md:border-s-[3px] md:border-s-transparent",
};

const invertedResponsiveIndicator = {
  active: "border-s-[3px] border-s-primary md:border-s-0 md:border-t-[3px] md:border-t-primary",
  idle: "border-s-[3px] border-s-transparent md:border-s-0 md:border-t-[3px] md:border-t-transparent",
};

const GNav = forwardRef<HTMLDivElement, GNavProps>(
  (
    {
      items,
      orientation = NavOrientationEnum.Vertical,
      indicator = IndicatorPositionEnum.Start,
      collapsed = false,
      stacked = false,
      responsive = false,
      responsiveInverted = false,
      className,
      ...props
    },
    ref,
  ) => {
    const isVertical = orientation === NavOrientationEnum.Vertical;
    const indicatorStyles =
      responsive && indicator === IndicatorPositionEnum.Start
        ? responsiveIndicator
        : responsiveInverted
          ? invertedResponsiveIndicator
          : navIndicator[indicator];
    const itemWidth = responsive ? "w-auto md:w-full" : responsiveInverted ? "w-full md:w-auto" : isVertical ? "w-full" : "shrink-0";

    return (
      <div
        ref={ref}
        className={clsx(
          "flex",
          responsive
            ? "flex-row flex-wrap gap-1 md:flex-col md:gap-1"
            : responsiveInverted
              ? "flex-col gap-1 md:flex-row md:flex-wrap md:gap-1"
              : clsx(isVertical ? "flex-col gap-1" : "flex-row"),
          className,
        )}>
        {items.map((item) => {
          const active = Boolean(item.active);
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              className={clsx(
                stacked
                  ? "flex-1 flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 min-w-0 text-2xs"
                  : clsx("flex items-center gap-3 px-3 h-11 text-sm min-w-0", itemWidth),
                "relative font-medium text-start",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                active ? indicatorStyles.active : indicatorStyles.idle,
                active ? navBase.itemActive : navBase.itemIdle,
                collapsed && "justify-center px-2",
              )}
              aria-current={active ? "page" : undefined}
              title={collapsed && item.label ? String(item.label) : undefined}
              onClick={item.onClick}
              {...props}>
              {item.icon && (
                <span className={clsx("relative shrink-0", collapsed && "mx-auto", stacked && "mb-0.5")}>
                  {item.icon}

                  {collapsed && item.badge && <span className="absolute -top-1.5 -inset-e-1.5">{item.badge}</span>}
                </span>
              )}
              {!collapsed && item.label && (
                <span className={clsx("min-w-0 leading-snug whitespace-normal truncate", (responsive || responsiveInverted) && "md:flex-1")}>
                  {item.label}
                </span>
              )}
              {!collapsed && item.badge && <span className="ms-auto shrink-0">{item.badge}</span>}
            </button>
          );
        })}
      </div>
    );
  },
);

GNav.displayName = "GNav";

export { GNav };
