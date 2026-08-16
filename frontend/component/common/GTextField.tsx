"use client";

import clsx from "clsx";
import { forwardRef, useId } from "react";
import { GLabel } from "./GLabel";
import type { IGTextFieldProps } from "./def/GTextField";
import { fieldBase, fieldSize } from "@/domain/constant/size-classes";
import { SizeEnum } from "@/domain/enum/SizeEnum";

const GTextField = forwardRef<HTMLInputElement, IGTextFieldProps>(
  ({ label, error, startIcon, endIcon, required, size = SizeEnum.md, className, name, id: providedId, type = "text", ...props }, ref) => {
    const generatedId = useId();
    const inputId = providedId ?? (name ? `field-${name}` : `field-${generatedId}`);
    const errorId = `${inputId}-error`;

    const hasStartIcon = Boolean(startIcon);
    const hasEndIcon = Boolean(endIcon);
    const isCheckbox = type === "checkbox";

    if (isCheckbox) {
      return (
        <div className="space-y-2">
          <label htmlFor={inputId} className={clsx("inline-flex cursor-pointer items-center gap-3", className)}>
            <span className="relative inline-flex shrink-0">
              <input
                ref={ref}
                id={inputId}
                name={name}
                type="checkbox"
                {...props}
                aria-describedby={error ? errorId : undefined}
                aria-invalid={error ? true : undefined}
                className="peer sr-only"
              />

              <span
                aria-hidden="true"
                className={clsx(
                  "relative h-6 w-11 rounded-full bg-border transition-colors",
                  "peer-checked:bg-primary",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-muted",
                  "after:absolute after:inset-s-1 after:top-1",
                  "after:h-4 after:w-4 after:rounded-full after:bg-white",
                  "after:transition-transform",
                  "peer-checked:after:translate-x-5",
                  "rtl:peer-checked:after:-translate-x-5",
                )}
              />
            </span>

            {label && (
              <GLabel required={required} htmlFor={inputId}>
                {label}
              </GLabel>
            )}
          </label>

          {error && (
            <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {label && (
          <GLabel required={required} htmlFor={inputId}>
            {label}
          </GLabel>
        )}

        <div className="relative">
          {startIcon && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-s-3 top-1/2 -translate-y-1/2 text-text-muted">
              {startIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            {...props}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? true : undefined}
            className={clsx(
              fieldBase,
              fieldSize[size],
              hasStartIcon && "ps-10",
              hasEndIcon && "pe-10",
              error && "border-danger focus:ring-3 focus:ring-danger-muted",
              className,
            )}
          />

          {endIcon && <span className="absolute inset-e-3 top-1/2 -translate-y-1/2">{endIcon}</span>}
        </div>

        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

GTextField.displayName = "GTextField";

export { GTextField };
