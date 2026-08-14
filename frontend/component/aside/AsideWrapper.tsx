"use client";

import clsx from "clsx";
import type { AsideWrapperProps } from "./def/AsideWrapper";

function AsideWrapper({ config, collapsed, header, children, footer, className }: AsideWrapperProps) {
  const { expandedWidth, collapsedWidth, label } = config;

  const width = collapsed ? collapsedWidth : expandedWidth;

  return (
    <aside aria-label={label} className={clsx("bg-bg-sidebar flex h-full shrink-0 flex-col", "border-border", "border-e", width, className)}>
      {header}

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">{children}</div>

      {footer && <footer className="shrink-0 border-t border-border">{footer}</footer>}
    </aside>
  );
}

export { AsideWrapper };
