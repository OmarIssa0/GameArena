"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { GLabel } from "./GLabel";
import type { GTextFieldProps } from "./def/GTextField";
import { INPUT_SIZES, FIELD_BASE_CLASS } from "./constants";
import { SizeEnum } from "@/domain/enum/SizeEnum";

const GTextField = forwardRef<HTMLInputElement, GTextFieldProps>(
  ({ label, error, startIcon, endIcon, required, size = SizeEnum.md, className, ...props }, ref) => {
    const hasStartIcon = Boolean(startIcon);
    const hasEndIcon = Boolean(endIcon);
    return (
      <div className="space-y-2">
        {label && <GLabel required={required}>{label}</GLabel>}
        <div className="relative">
          {startIcon && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-s-3 top-1/2 -translate-y-1/2 text-text-muted">
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            {...props}
            className={clsx(
              FIELD_BASE_CLASS,
              INPUT_SIZES[size],
              hasStartIcon && "ps-10",
              hasEndIcon && "pe-10",
              error && "border-error focus:ring-3 focus:ring-error-muted",
              className,
            )}
          />
          {endIcon && <span className="absolute inset-e-3 top-1/2 -translate-y-1/2">{endIcon}</span>}
        </div>
        {error && (
          <p role="alert" className="text-xs text-error mt-1.5">
            {error}
          </p>
        )}
      </div>
    );
  },
);

GTextField.displayName = "GTextField";

export { GTextField };
