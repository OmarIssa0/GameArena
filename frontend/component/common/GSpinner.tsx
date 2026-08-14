"use client";

import clsx from "clsx";
import { Loader2 } from "lucide-react";
import type { GSpinnerProps } from "./def/GSpinner";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { spinnerSize } from "@/domain/constant/size-classes";

function GSpinner({ size = SizeEnum.md, className, ariaLabel }: GSpinnerProps) {
  return <Loader2 role="status" aria-label={ariaLabel} className={clsx("animate-spin text-primary", spinnerSize[size], className)} />;
}

export { GSpinner };
