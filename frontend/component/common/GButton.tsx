"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { GSpinner } from "./GSpinner";
import type { GButtonProps } from "./def/GButton";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { AccentBackGroundEnum } from "@/domain/enum/AccentBackGroundEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { THashMap } from "@/domain/type/TCommon";

const sizeStyles: THashMap<string> = {
  [SizeEnum.xs]: "h-9 px-2.5 text-xs gap-1",
  [SizeEnum.sm]: "h-10 px-3 text-sm gap-1.5",
  [SizeEnum.md]: "h-11 px-4 text-sm gap-2",
  [SizeEnum.lg]: "h-12 px-5 text-base gap-2.5",
  [SizeEnum.xl]: "h-12 px-6 text-lg gap-2.5",
  [SizeEnum.icon]: "h-11 w-11 p-0",
};

const roundedStyles: THashMap<string> = {
  [SizeEnum.sm]: "rounded-[var(--radius-sm)]",
  [SizeEnum.md]: "rounded-[var(--radius-md)]",
  [SizeEnum.lg]: "rounded-[var(--radius-lg)]",
  [SizeEnum.xl]: "rounded-[var(--radius-xl)]",
  [SizeEnum.full]: "rounded-full",
  [SizeEnum.None]: "rounded-none",
};

const variantStyles: Record<AccentColorEnum, string> = {
  [AccentColorEnum.Primary]: `${AccentBackGroundEnum.Primary} ${AccentColorEnum.OnPrimary} ${AccentBackGroundEnum.PrimaryHover}`,
  [AccentColorEnum.Secondary]: `${AccentBackGroundEnum.Surface} ${AccentColorEnum.Text} border border-border ${AccentBackGroundEnum.SurfaceHover}`,
  [AccentColorEnum.Muted]: `${AccentBackGroundEnum.Transparent} ${AccentColorEnum.Secondary} ${AccentBackGroundEnum.PrimaryHover.replace("hover:", "")} hover:${AccentColorEnum.Primary}`,
  [AccentColorEnum.Success]: `${AccentBackGroundEnum.Success} ${AccentColorEnum.OnPrimary} ${AccentBackGroundEnum.SuccessHover}`,
  [AccentColorEnum.Warning]: `${AccentBackGroundEnum.Warning} ${AccentColorEnum.OnPrimary} ${AccentBackGroundEnum.WarningHover}`,
  [AccentColorEnum.Danger]: `${AccentBackGroundEnum.Error} ${AccentColorEnum.OnPrimary} ${AccentBackGroundEnum.ErrorHover}`,
  [AccentColorEnum.Inherit]: `${AccentBackGroundEnum.Transparent} ${AccentColorEnum.Secondary} ${AccentBackGroundEnum.PrimaryHover.replace("hover:", "")} hover:${AccentColorEnum.Primary}`,
  [AccentColorEnum.OnPrimary]: `${AccentBackGroundEnum.Transparent} ${AccentColorEnum.OnPrimary} ${AccentBackGroundEnum.PrimaryHover.replace("hover:", "")} hover:${AccentColorEnum.Primary}`,
  [AccentColorEnum.Accent]: `${AccentBackGroundEnum.Accent} ${AccentColorEnum.OnPrimary} ${AccentBackGroundEnum.AccentHover}`,
  [AccentColorEnum.Text]: `${AccentBackGroundEnum.Transparent} ${AccentColorEnum.Primary} hover:text-primary-hover underline-offset-4 hover:underline h-auto p-0`,
};

const GButton = forwardRef<HTMLButtonElement, GButtonProps>(
  (
    {
      children,
      loading,
      disabled,
      variant = AccentColorEnum.Primary,
      size = SizeEnum.md,
      rounded = SizeEnum.md,
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
          isIconOnly && size !== SizeEnum.icon && "p-0",
          className,
        )}
        {...props}>
        {loading ? (
          <span className="opacity-70 flex items-center gap-1.5">
            <GSpinner size={SizeEnum.sm} />
            {resolvedLoadingText}
          </span>
        ) : (
          <>
            {startIcon && <span className="shrink-0">{startIcon}</span>}
            {children}
            {endIcon && <span className="shrink-0">{endIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

GButton.displayName = "GButton";

export { GButton };
