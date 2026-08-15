"use client";

import clsx from "clsx";
import { AlertTriangle } from "lucide-react";
import { GButton } from "./GButton";
import { GEmpty } from "./GEmpty";
import { GIcon } from "./GIcon";
import { GSpinner } from "./GSpinner";
import type { IGAsyncProps } from "./def/GAsync";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

const DEFAULT_ERROR_TITLE = "Error";
const DEFAULT_RETRY_LABEL = "Retry";

function GAsync({
  loading,
  error,
  children,
  spinnerSize = SizeEnum.md,
  spinnerLabel,
  errorTitle = DEFAULT_ERROR_TITLE,
  errorIcon = AlertTriangle,
  errorIconColor = AccentColorEnum.Danger,
  retryLabel = DEFAULT_RETRY_LABEL,
  onRetry,
  className,
}: IGAsyncProps) {
  if (loading) {
    return (
      <div className={clsx("flex flex-col items-center justify-center gap-3", className)}>
        <GSpinner size={spinnerSize} ariaLabel={spinnerLabel} />
        {spinnerLabel && <p className="text-sm text-text-secondary">{spinnerLabel}</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className={clsx("flex flex-col items-center justify-center", className)}>
        <GEmpty icon={<GIcon icon={errorIcon} size={SizeEnum.xl} color={errorIconColor} />} title={errorTitle} description={error}>
          {onRetry && (
            <GButton variant={ButtonVariantEnum.Primary} size={SizeEnum.md} className="mt-4" onClick={onRetry}>
              {retryLabel}
            </GButton>
          )}
        </GEmpty>
      </div>
    );
  }

  return <>{children}</>;
}

export { GAsync };
