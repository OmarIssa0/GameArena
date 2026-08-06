"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";
import { GLabel } from "./GLabel";
import type { GSelectProps } from "./def/GSelect";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { THashMap } from "@/domain/type/TCommon";

const inputSize: THashMap<string> = {
  [SizeEnum.xs]: "px-1 py-1.5 text-xs",
  [SizeEnum.sm]: "px-1 py-1 text-sm",
  [SizeEnum.md]: "px-2 py-2 text-sm",
  [SizeEnum.lg]: "px-2 py-2.5 text-base",
  [SizeEnum.xl]: "px-3 py-3 text-base",
  [SizeEnum.icon]: "px-3 py-3 text-base",
};

const GSelect = forwardRef<HTMLSelectElement, GSelectProps<string | number>>(
  ({ label, error, className, startIcon, options, placeholder, size = SizeEnum.md, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <GLabel required={props.required}>{label}</GLabel>}

        <div className="relative">
          {startIcon && <div className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-text-muted">{startIcon}</div>}

          <select
            ref={ref}
            className={clsx(
              "w-full bg-surface border border-border rounded-md text-text transition-all duration-150 appearance-none",
              "hover:border-border-light focus:border-primary focus:ring-3 focus:ring-primary-muted",
              "placeholder:text-text-muted",
              inputSize[size],
              startIcon && "ps-9",
              "pe-9",
              error && "border-error focus:ring-3 focus:ring-error-muted",
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
          <p role="alert" className="text-xs text-error mt-1.5">
            {error}
          </p>
        )}
      </div>
    );
  },
);

GSelect.displayName = "GSelect";

export { GSelect };
