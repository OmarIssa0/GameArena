import clsx from "clsx";
import type { ReactNode } from "react";
import { GIcon } from "./GIcon";
import { GCard } from "./GCard";
import type { LucideIcon } from "lucide-react";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import type { IPageHeaderProps } from "./def/PageHeader";

function PageHeader({ icon, title, subtitle, badge, className }: IPageHeaderProps) {
  return (
    <GCard variant={CardVariantEnum.Elevated} padding={SizeEnum.md} className={clsx("mb-5", className)}>
      <header className="flex items-center gap-3">
        <GIcon icon={icon} size={SizeEnum.xl} tile tileColor={AccentColorEnum.OnPrimary} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-text tracking-tight leading-tight truncate">{title}</h1>
            {badge && <div className="mb-1 shrink-0">{badge}</div>}
          </div>
          {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
        </div>
      </header>
    </GCard>
  );
}

export { PageHeader };
