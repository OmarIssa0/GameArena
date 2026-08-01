import clsx from "clsx";
import type { GPageProps } from "./def/GPage";
import { SizeEnum } from "@/domain/enum/SizeEnum";

const pageWidth: Record<SizeEnum, string> = {
  [SizeEnum.None]: "max-w-[48rem]",
  [SizeEnum.xs]: "max-w-[30rem]",
  [SizeEnum.sm]: "max-w-[36rem]",
  [SizeEnum.md]: "max-w-[48rem]",
  [SizeEnum.lg]: "max-w-[72rem]",
  [SizeEnum.xl]: "max-w-[80rem]",
  [SizeEnum.icon]: "max-w-[48rem]",
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