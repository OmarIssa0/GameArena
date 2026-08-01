"use client";

import type React from "react";
import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";
import { GBackdrop } from "./GBackdrop";
import { GCard } from "./GCard";
import type { GModalProps } from "./def/GModal";
import type { THashMap, TNullable } from "@/domain/type/TCommon";
import { SizeEnum } from "@/domain/enum/SizeEnum";

const sizeStyles: THashMap<string> = {
  [SizeEnum.sm]: "max-w-xs",
  [SizeEnum.md]: "max-w-sm",
  [SizeEnum.lg]: "max-w-md",
  [SizeEnum.xl]: "max-w-lg",
};

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

function GModal({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  size = SizeEnum.md,
  cardPadding = SizeEnum.lg,
  role = "dialog",
  ariaLabel,
  ariaDescription,
  className,
  ...props
}: GModalProps) {
  const modalRef = useRef<TNullable<HTMLDivElement>>(null);
  const previousFocusRef = useRef<TNullable<HTMLElement>>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

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
      }
    },
    [closeOnEscape, onClose],
  );

  const handleBackdropClick = useCallback(() => {
    if (!closeOnBackdrop) return;
    onClose();
  }, [closeOnBackdrop, onClose]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    document.addEventListener("keydown", handleKeyDown);

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
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      ref={modalRef}
      className={clsx("fixed inset-0 z-50 flex items-center justify-center", className)}
      role={role}
      aria-modal="true"
      aria-label={ariaLabel}
      aria-describedby={ariaDescription ? "modal-description" : undefined}
      {...props}>
      <GBackdrop onClick={handleBackdropClick} />
      <GCard
        padding={cardPadding}
        className={clsx("relative z-50 mx-auto w-full", sizeStyles[size])}
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
