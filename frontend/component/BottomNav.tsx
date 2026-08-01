"use client";

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
    <nav className="fixed inset-inline-0 bottom-0 flex items-center justify-around h-18 pb-[env(safe-area-inset-bottom)] bg-bg-sidebar border-t border-border z-fixed md:hidden overflow-x-auto w-full custom-scrollbar" role="navigation" aria-label="Bottom navigation">
      <div className="flex items-center justify-center min-w-full">
        {sidebarNav.map((item) => (
          <a
            key={item.id}
            href={`/${item.id}`}
            className={clsx(
              "flex flex-col items-center gap-0.5 p-2 text-text-muted bg-transparent border-none cursor-pointer transition-all min-w-18",
              isActive(item.id) && "text-primary translate-y-[-2px]",
            )}
            aria-current={isActive(item.id) ? "page" : undefined}>
            <GIcon icon={item.icon} size={SizeEnum.md} />
            <span className="text-2xs font-semibold">{t[item.labelKey as keyof TSidebarTranslation]}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
