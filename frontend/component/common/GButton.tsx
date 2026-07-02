"use client";

import { forwardRef } from "react";
import clsx from "clsx";
import { useTranslation } from "@/hooks/useSetting";
import { en, type GButtonTranslation } from "@/component/i18n/GButton/en.i18n";
import { ar } from "@/component/i18n/GButton/ar.i18n";
import { GButtonProps } from "./def/GButton";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-surface border border-border text-text hover:border-primary",
  ghost: "hover:bg-primary/10 text-text-secondary hover:text-text",
  danger: "bg-error text-white hover:bg-red-600",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5",
  lg: "h-12 px-6 text-lg",
  icon: "h-10 w-10 p-0 shrink-0",
};

const GButton = forwardRef<HTMLButtonElement, GButtonProps>(
  (
    {
      children,
      loading,
      disabled,
      variant = "primary",
      size = "md",
      className,
      leftIcon,
      rightIcon,
      loadingText,
      fullWidth,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const t = useTranslation({ en, ar }) as GButtonTranslation;
    const isDisabled = disabled || loading;
    const resolvedLoadingText = loadingText ?? t.loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 active:scale-95",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          isDisabled && "opacity-50 cursor-not-allowed active:scale-100",
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="animate-pulse">{resolvedLoadingText}</span>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  },
);

GButton.displayName = "GButton";

export { GButton };
