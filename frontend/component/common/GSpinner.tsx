"use client";

import clsx from "clsx";
import { Loader2 } from "lucide-react";
import type { GSpinnerProps } from "./def/GSpinner";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { THashMap } from "@/domain/type/TCommon";

const sizeMap: THashMap<string> = {
  [SizeEnum.xs]: "h-4 w-4",
  [SizeEnum.sm]: "h-4 w-4",
  [SizeEnum.md]: "h-6 w-6",
  [SizeEnum.lg]: "h-10 w-10",
  [SizeEnum.xl]: "h-10 w-10",
  [SizeEnum.icon]: "h-6 w-6",
};

function GSpinner({ size = SizeEnum.md, className }: GSpinnerProps) {
  return <Loader2 className={clsx("animate-spin text-primary", sizeMap[size], className)} />;
}

export { GSpinner };
