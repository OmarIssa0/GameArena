"use client";

import clsx from "clsx";
import { GBackdrop } from "../common/GBackdrop";
import { GButton } from "../common/GButton";
import type { AsideConfig, AsideState } from "./AsideTypes";
import { AsidePlacementEnum } from "@/domain/enum/AsidePlacementEnum";

interface AsideWrapperProps {
  config: AsideConfig;
  aside: AsideState;
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  mobileFab?: React.ReactNode;
  className?: string;
}

function AsideWrapper({ config, aside, header, children, footer, mobileFab, className }: AsideWrapperProps) {
  const { collapsed, open, isDesktop, closeMobile } = aside;
  const { placement, expandedWidth, collapsedWidth, label } = config;

  const isInlineDesktop = isDesktop;
  const isOverlay = !isInlineDesktop;
  const showBackdrop = isOverlay && open;

  const openFab = mobileFab ?? (
    <GButton
      variant="secondary"
      size="icon"
      rounded="full"
      onClick={aside.openMobile}
      className={clsx("fixed bottom-4", placement === AsidePlacementEnum.Start ? "inset-s-4" : "end-4")}
      aria-label={`Open ${label}`}>
      {config.mobileIcon}
    </GButton>
  );

  const openTransform = placement === AsidePlacementEnum.Start ? "ltr:translate-x-0 rtl:-translate-x-0" : "translate-x-0";
  const closedTransform =
    placement === AsidePlacementEnum.Start ? "ltr:-translate-x-full rtl:translate-x-full" : "ltr:translate-x-full rtl:-translate-x-full";

  const asideClass = clsx(
    "flex flex-col shrink-0 h-dvh-safe bg-bg-sidebar transition-transform duration-200",
    placement === AsidePlacementEnum.Start ? "border-e border-border" : "border-s border-border",
    isInlineDesktop
      ? collapsed
        ? collapsedWidth
        : expandedWidth
      : [
          "fixed inset-y-0 z-50",
          placement === AsidePlacementEnum.Start ? "start-0" : "end-0",
          open ? [openTransform, expandedWidth] : [closedTransform, "w-0 overflow-hidden border-0 pointer-events-none"],
        ],
    className,
  );

  return (
    <>
      {showBackdrop && <GBackdrop onClick={closeMobile} />}

      <aside
        className={asideClass}
        aria-label={label}
        role={isOverlay ? "dialog" : undefined}
        aria-modal={isOverlay && open ? true : undefined}
        aria-hidden={isOverlay && !open ? true : undefined}>
        {header}

        {(isInlineDesktop || open) && <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">{children}</main>}

        {footer && (isInlineDesktop || open) && <footer className="border-t border-border">{footer}</footer>}
      </aside>

      {isOverlay && !open && openFab}
    </>
  );
}

export { AsideWrapper };
export type { AsideWrapperProps };
