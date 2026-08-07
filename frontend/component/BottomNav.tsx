"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useSetting";
import { GIcon } from "@/component/common/GIcon";
import clsx from "clsx";
import { sidebarNav } from "@/domain/constant/sidebarNav";
import { en as EnSidebar, type TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";
import { ar as ArSidebar } from "@/component/i18n/SideBar/ar.i18n";
import { SizeEnum } from "@/domain/enum/SizeEnum";

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslation({ en: EnSidebar, ar: ArSidebar }) as TSidebarTranslation;

  const isActive = (id: string) => {
    const href = `/${id}`;
    return pathname === href || (id !== "home" && pathname.startsWith(href));
  };

  return (
    <nav className="fixed inset-inline-0 bottom-0 flex items-center justify-around h-18 pb-[env(safe-area-inset-bottom)] bg-bg-sidebar border-t border-border z-fixed lg:hidden overflow-x-auto w-full custom-scrollbar" role="navigation" aria-label={t.mainNavigation}>
      <div className="flex items-center justify-center min-w-full">
        {sidebarNav.map((item) => {
          const active = isActive(item.id);
          return (
            <Link
              key={item.id}
              href={`/${item.id}`}
              className={clsx(
                "relative flex flex-col items-center gap-0.5 p-2 text-text-muted bg-transparent border-none cursor-pointer transition-all min-w-18",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg",
                active && "text-primary",
              )}
              aria-current={active ? "page" : undefined}>
              {active && <span className="absolute top-0 inset-inline-2 h-0.5 rounded-full bg-primary" />}
              <GIcon icon={item.icon} size={SizeEnum.md} />
              <span className="text-2xs font-semibold">{t[item.labelKey as keyof TSidebarTranslation]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
