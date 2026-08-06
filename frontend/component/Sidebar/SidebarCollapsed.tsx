"use client";

import clsx from "clsx";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/app/providers/AuthProvider";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { GAvatar } from "@/component/common/GAvatar";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { ar } from "@/component/i18n/SideBar/ar.i18n";
import { en, type TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";
import { LangTheme } from "@/component/LangTheme";
import { sidebarNav } from "@/domain/constant/sidebarNav";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { AvatarShapeEnum } from "@/domain/enum/AvatarShapeEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useLogout } from "@/hooks/useLogout";
import { useTranslation } from "@/hooks/useSetting";

import type { ISidebarProps } from "./def/Sidebar";

export function SidebarCollapsed({ closeMobile }: ISidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslation({ en, ar }) as TSidebarTranslation;
  const { friendRequestCount, unreadMessageCount, gameInvites, unreadNotificationCount } = useDashboardNotifications();
  const { user } = useAuth();
  const logout = useLogout();

  const activeId = sidebarNav.find((n) => pathname.startsWith(`/${n.id}`))?.id ?? "home";

  const handleNav = (id: string) => {
    router.push(`/${id}`);
    if (closeMobile) closeMobile();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation icons */}
      <nav className="flex-1 flex flex-col items-center gap-1 px-2 py-4" aria-label={t.mainNavigation}>
        {sidebarNav.map(({ id, icon: Icon, badge }) => {
          const isActive = activeId === id;
          const badgeCount =
            badge === "friends"
              ? friendRequestCount
              : badge === "messages"
                ? unreadMessageCount
                : badge === "invites"
                  ? gameInvites.length + unreadNotificationCount
                  : 0;

          return (
            <GButton
              key={id}
              onClick={() => handleNav(id)}
              variant={AccentColorEnum.Muted}
              size={SizeEnum.icon}
              className={clsx("relative w-11 h-11", isActive ? "bg-primary-muted text-primary" : "text-text-secondary hover:bg-primary-muted hover:text-text")}
              aria-label={t[id as keyof TSidebarTranslation] ?? id}
              title={t[id as keyof TSidebarTranslation] ?? id}
              aria-current={isActive ? "page" : undefined}>
              <GIcon icon={Icon} size={SizeEnum.md} />
              {badgeCount > 0 && <span className="absolute top-1.5 inset-x-0 mx-auto w-2 h-2 rounded-full bg-primary ring-2 ring-bg-sidebar" />}
            </GButton>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-3 px-2 pb-safe pb-3">
        <LangTheme collapsed />

        {user && (
          <GButton
            onClick={() => handleNav("settings")}
            variant={AccentColorEnum.Muted}
            size={SizeEnum.icon}
            className="w-11 h-11"
            aria-label={t.settings}
            title={t.settings}>
            <GAvatar firstName={user.firstName} lastName={user.lastName} status={user.status} size={SizeEnum.sm} shape={AvatarShapeEnum.Circle} />
          </GButton>
        )}

        <GButton
          onClick={logout}
          variant={AccentColorEnum.Muted}
          size={SizeEnum.icon}
          title={t.logout}
          aria-label={t.logout}
          className="w-11 h-11">
          <GIcon icon={LogOut} size={SizeEnum.md} />
        </GButton>
      </div>
    </div>
  );
}
