"use client";

import type React from "react";
import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";
import { GBackdrop } from "./GBackdrop";
import { GCard } from "./GCard";
import type { GModalProps, GModalSide } from "./def/GModal";
import type { TNullable } from "@/domain/type/TCommon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { modalSize } from "@/domain/constant/size-classes";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

const sheetSideStyles: Record<Exclude<GModalSide, "center">, string> = {
  start: "inset-y-0 start-0 w-72 sheet-max-width border-e border-border",
  end: "inset-y-0 end-0 w-80 sheet-max-width border-s border-border",
  bottom: "inset-x-0 bottom-0 sheet-max-height border-t border-border rounded-t-3xl",
};

function GModal({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  size = SizeEnum.md,
  cardPadding = SizeEnum.lg,
  side = "center",
  panelClassName,
  role = "dialog",
  ariaLabel,
  ariaDescription,
  className,
  ...props
}: GModalProps) {
  const modalRef = useRef<TNullable<HTMLDivElement>>(null);
  const previousFocusRef = useRef<TNullable<HTMLElement>>(null);

  const isSheet = side !== "center";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
        return;
      }

      if (isSheet || !modalRef.current) return;

      if (e.key !== "Tab") return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [closeOnEscape, isSheet, onClose],
  );

  const handleBackdropClick = useCallback(() => {
    if (!closeOnBackdrop) return;
    onClose();
  }, [closeOnBackdrop, onClose]);

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", handleKeyDown);

    if (isSheet) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
        document.removeEventListener("keydown", handleKeyDown);
      };
    }

    previousFocusRef.current = document.activeElement as HTMLElement;

    const timer = requestAnimationFrame(() => {
      if (modalRef.current) {
        const focusable = modalRef.current.querySelector<HTMLElement>(FOCUSABLE);
        focusable?.focus();
      }
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(timer);
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [open, isSheet, handleKeyDown]);

  if (isSheet) {
    return (
      <div className={className}>
        {open && (
          <>
            <GBackdrop onClick={handleBackdropClick} />
            <aside
              role={role}
              aria-modal="true"
              aria-label={ariaLabel}
              className={clsx("fixed z-drawer flex flex-col bg-bg-sidebar", sheetSideStyles[side], panelClassName)}>
              {children}
            </aside>
          </>
        )}
      </div>
    );
  }

  if (!open) return null;

  return (
    <div
      ref={modalRef}
      className={clsx("fixed inset-0 z-modal flex items-center justify-center", className)}
      role={role}
      aria-modal="true"
      aria-label={ariaLabel}
      aria-describedby={ariaDescription ? "modal-description" : undefined}
      {...props}>
      <GBackdrop onClick={handleBackdropClick} />
      <GCard
        padding={cardPadding}
        className={clsx("relative z-modal mx-auto w-full ", modalSize[size])}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        {ariaDescription && (
          <p id="modal-description" className="sr-only">
            {ariaDescription}
          </p>
        )}
        {children}
      </GCard>
    </div>
  );
}

export { GModal };