"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { GSpinner } from "./GSpinner";
import type { GButtonProps } from "./def/GButton";

const sizeStyles: Record<string, string> = {
  xs: "h-9 px-2.5 text-xs gap-1",
  sm: "h-10 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2.5",
  xl: "h-12 px-6 text-lg gap-2.5",
  icon: "h-11 w-11 p-0",
};

const roundedStyles: Record<string, string> = {
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  xl: "rounded-[var(--radius-xl)]",
  full: "rounded-full",
};

const variantStyles: Record<string, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "bg-surface text-text border border-border hover:bg-surface-hover",
  outline: "bg-transparent text-text border border-border hover:bg-primary-muted hover:border-primary hover:text-primary",
  ghost: "bg-transparent text-text-secondary hover:bg-primary-muted hover:text-primary",
  danger: "bg-error text-on-primary hover:bg-error-hover",
  success: "bg-success text-on-primary hover:bg-success-hover",
  link: "bg-transparent text-primary hover:text-primary-hover underline-offset-4 hover:underline h-auto p-0",
  "outline-danger": "bg-transparent text-error border border-error/30 hover:bg-error-muted hover:border-error",
};

const GButton = forwardRef<HTMLButtonElement, GButtonProps>(
  (
    {
      children,
      loading,
      disabled,
      variant = "primary",
      size = "md",
      rounded = "md",
      className,
      startIcon,
      endIcon,
      loadingText,
      fullWidth,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const resolvedLoadingText = loadingText ?? "Loading...";
    const isIconOnly = !children && (startIcon || endIcon);

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center justify-center font-semibold whitespace-nowrap cursor-pointer gap-2 transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          variantStyles[variant],
          sizeStyles[size],
          roundedStyles[rounded],
          fullWidth && "w-full",
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isIconOnly && size !== "icon" && "p-0",
          className,
        )}
        {...props}>
        {loading ? (
          <span className="opacity-70 flex items-center gap-1.5">
            <GSpinner size="sm" />
            {resolvedLoadingText}
          </span>
        ) : (
          <>
            {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
            {children}
            {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

GButton.displayName = "GButton";

export { GButton };
