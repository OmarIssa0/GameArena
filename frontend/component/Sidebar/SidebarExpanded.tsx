"use client";

import { useMemo } from "react";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/app/providers/AuthProvider";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { GAvatar } from "@/component/common/GAvatar";
import { GBadge } from "@/component/common/GBadge";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import { GNav, type GNavItem } from "@/component/common/GNav";
import { ar } from "@/component/i18n/SideBar/ar.i18n";
import { en, type TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";
import { LangTheme } from "@/component/LangTheme";
import { sidebarNav } from "@/domain/constant/sidebarNav";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { AvatarShapeEnum } from "@/domain/enum/AvatarShapeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { IndicatorPositionEnum } from "@/domain/enum/IndicatorPositionEnum";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useLogout } from "@/hooks/useLogout";
import { useTranslation } from "@/hooks/useSetting";

import type { ISidebarProps } from "./def/Sidebar";

export function SidebarExpanded({ closeMobile }: ISidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslation({ en, ar }) as TSidebarTranslation;
  const { friendRequestCount, unreadMessageCount, gameInvites, unreadNotificationCount } = useDashboardNotifications();
  const { user } = useAuth();
  const logout = useLogout();

  const activeId = sidebarNav.find((n) => pathname.startsWith(`/${n.id}`))?.id ?? "home";

  const navItems = useMemo<GNavItem[]>(
    () =>
      sidebarNav
        .map(({ id, labelKey, icon: Icon, badge }) => ({
          id,
          icon: <GIcon icon={Icon} size={SizeEnum.md} />,
          label: t[labelKey as keyof TSidebarTranslation],
          active: activeId === id,
          badgeCount:
            badge === "friends"
              ? friendRequestCount
              : badge === "messages"
                ? unreadMessageCount
                : badge === "invites"
                  ? gameInvites.length + unreadNotificationCount
                  : 0,
        }))
        .map((item) => ({
          ...item,
          onClick: () => {
            router.push(`/${item.id}`);
            if (closeMobile) closeMobile();
          },
          badge:
            item.badgeCount > 0 ? (
              <GBadge size={SizeEnum.sm} className="ms-auto min-w-5 justify-center">
                {item.badgeCount}
              </GBadge>
            ) : undefined,
        })),
    [t, friendRequestCount, unreadMessageCount, gameInvites.length, unreadNotificationCount, activeId, router, closeMobile],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <nav className="flex-1 px-3 py-2" aria-label={t.mainNavigation}>
        <GNav items={navItems} orientation={NavOrientationEnum.Vertical} indicator={IndicatorPositionEnum.Start} collapsed={false} />
      </nav>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="flex flex-col gap-2 p-3 pb-safe">
          <LangTheme collapsed={false} />

          <GCard padding={SizeEnum.sm} variant={CardVariantEnum.Outlined} className="flex items-center gap-3">
            <div className="relative shrink-0">
              {user && (
                <GAvatar firstName={user.firstName} lastName={user.lastName} status={user.status} size={SizeEnum.sm} shape={AvatarShapeEnum.Circle} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-text-secondary truncate">@{user?.userName}</p>
            </div>

            <GButton
              onClick={logout}
              variant={AccentColorEnum.Muted}
              size={SizeEnum.lg}
              className="p-3! rounded-xl"
              title={t.logout}
              aria-label={t.logout}>
              <GIcon icon={LogOut} size={SizeEnum.md} />
            </GButton>
          </GCard>
        </div>
      </footer>
    </div>
  );
}
