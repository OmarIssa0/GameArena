"use client";

import { RefreshCw } from "lucide-react";
import clsx from "clsx";
import type { GErrorBannerProps } from "./def/GErrorBanner";
import { GButton } from "./GButton";

function GErrorBanner({
  message,
  onRetry,
  retryLabel,
  className,
}: GErrorBannerProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-error/30 bg-error-bg px-4 text-error",
        onRetry ? "py-4" : "py-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm">{message}</p>
        {onRetry && (
          <GButton
            variant="secondary"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            {retryLabel ?? "Retry"}
          </GButton>
        )}
      </div>
    </div>
  );
}

export { GErrorBanner };
