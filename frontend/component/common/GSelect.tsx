"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { forwardRef, useId } from "react";
import { GLabel } from "./GLabel";
import type { GSelectProps } from "./def/GSelect";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { fieldSize } from "@/domain/constant/size-classes";

const GSelect = forwardRef<HTMLSelectElement, GSelectProps<string | number>>(
  ({ label, error, className, startIcon, options, placeholder, size = SizeEnum.md, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const selectId = providedId ?? `select-${generatedId}`;
    const errorId = `${selectId}-error`;
    return (
      <div className="space-y-2">
        {label && <GLabel required={props.required} htmlFor={selectId}>{label}</GLabel>}

        <div className="relative">
          {startIcon && <div className="pointer-events-none absolute inset-s-3 top-1/2 -translate-y-1/2 text-text-muted">{startIcon}</div>}

          <select
            ref={ref}
            id={selectId}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? true : undefined}
            className={clsx(
              "w-full bg-surface border border-border rounded-md text-text appearance-none",
              "hover:border-border-light focus:border-primary focus:ring-3 focus:ring-primary-muted",
              "placeholder:text-text-muted",
              fieldSize[size],
              startIcon && "ps-10",
              "pe-9",
              error && "border-danger focus:ring-3 focus:ring-danger-muted",
              className,
            )}
            {...props}>
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

          <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-danger mt-1.5">
            {error}
          </p>
        )}
      </div>
    );
  },
);

GSelect.displayName = "GSelect";

export { GSelect };
