"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";
import type { GSelectProps } from "./def/GSelect";

const GSelect = forwardRef<HTMLSelectElement, GSelectProps<string | number>>(
  ({ label, error, className, startIcon, options, placeholder, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium">
            {label}
            {props.required && (
              <span className="text-red-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {startIcon}
            </div>
          )}

          <select
            ref={ref}
            className={clsx(
              "w-full appearance-none rounded-2xl border border-border bg-bg-card py-3 text-sm text-text outline-none transition focus:border-primary",
              startIcon && "pl-9",
              "pr-9",
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        </div>

        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  },
);

GSelect.displayName = "GSelect";

export { GSelect };
