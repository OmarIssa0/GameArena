import clsx from "clsx";
import type { GPageProps } from "./def/GPage";
import { SizeEnum } from "@/domain/enum/SizeEnum";

const pageWidth: Record<SizeEnum, string> = {
  [SizeEnum.None]: "max-w-3xl",
  [SizeEnum.xs]: "max-w-xl",
  [SizeEnum.sm]: "max-w-2xl",
  [SizeEnum.md]: "max-w-3xl",
  [SizeEnum.lg]: "max-w-6xl",
  [SizeEnum.xl]: "max-w-7xl",
  [SizeEnum.icon]: "max-w-3xl",
  [SizeEnum.full]: "max-w-full",
};

function GPage({ children, size = SizeEnum.md, className }: GPageProps) {
  return (
    <div className={clsx("flex-1 min-h-0 p-6 sm:p-8 lg:p-10", className)}>
      <div className={clsx("mx-auto w-full", pageWidth[size])}>
        {children}
      </div>
    </div>
  );
}

export { GPage };