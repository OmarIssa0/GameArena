"use client";

import clsx from "clsx";
import { GBadge } from "./GBadge";
import type { IGTabsProps } from "./def/GTabs";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { GButton } from "./GButton";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

function renderTabBadge<T extends string | number>(tab: { id: T; badge?: number }, renderBadge: IGTabsProps<T>["renderBadge"], active: boolean) {
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
  responsive = true,
  className,
  tabClassName,
  fullWidth,
  children,
}: IGTabsProps<T>) {
  return (
    <div className={responsive ? "w-full mb-3" : undefined}>
      <nav
        aria-orientation={responsive ? undefined : "horizontal"}
        className={clsx(
          "flex border rounded-2xl overflow-hidden",
          responsive ? "flex-col md:flex-row md:flex-wrap" : clsx("flex-row", fullWidth ? "flex-nowrap" : "flex-wrap"),
          fullWidth && !responsive && "w-full",
          className,
        )}>
        {tabs.map((tab) => {
          const active = value === tab.id;

          return (
            <GButton
              key={tab.id}
              variant={active ? ButtonVariantEnum.Primary : ButtonVariantEnum.Subtle}
              rounded={SizeEnum.None}
              onClick={() => onChange(tab.id)}
              className={clsx(
                fullWidth && !responsive && "flex-1 justify-center",
                fullWidth && responsive && "w-full md:flex-1 md:justify-center",
                tabClassName,
              )}>
              {renderIcon ? renderIcon(tab, active) : tab.icon}
              <span
                className={clsx(
                  "min-w-0 truncate leading-snug",
                  responsive ? "flex-1 text-start whitespace-normal md:flex-none md:text-center" : "whitespace-nowrap",
                )}>
                {renderLabel ? renderLabel(tab, active) : tab.label}
              </span>
              {renderTabBadge(tab, renderBadge, active)}
            </GButton>
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
