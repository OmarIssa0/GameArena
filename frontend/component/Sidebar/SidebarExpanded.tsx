"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { LogOut } from "lucide-react";

import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { useConnections } from "@/app/providers/ConnectionProvider";
import { authService } from "@/services/def/AuthService";
import { sidebarNav } from "@/domain/constant/sidebarNav";
import { ar } from "@/component/i18n/SideBar/ar.i18n";
import { en, type TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";
import { GNav, type GNavItem } from "@/component/common/GNav";
import { GButton } from "@/component/common/GButton";
import { GBadge } from "@/component/common/GBadge";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import { GAvatar } from "@/component/common/GAvatar";
import { LangTheme } from "@/component/LangTheme";

export function SidebarExpanded({ closeMobile }: { closeMobile?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslation({ en, ar }) as TSidebarTranslation;
  const { friendRequestCount, unreadMessageCount, gameInvites, unreadNotificationCount } = useDashboardNotifications();
  const { user, setUser } = useAuth();
  const { stopConnections } = useConnections();

  const activeId = sidebarNav.find((n) => pathname.startsWith(`/${n.id}`))?.id ?? "home";

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      await stopConnections();
      setUser(null);
      router.replace("/login");
    }
  };

  const navItems = useMemo<GNavItem[]>(
    () =>
      sidebarNav
        .map(({ id, labelKey, icon: Icon, badge }) => ({
          id,
          icon: <GIcon icon={Icon} size="md" color="inherit" />,
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
              <GBadge size="sm" className="ms-auto min-w-5 justify-center">
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
        <GNav items={navItems} orientation="vertical" indicator="start" collapsed={false} />
      </nav>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="flex flex-col gap-2 p-3 pb-safe">
          <LangTheme collapsed={false} />

          <GCard padding="sm" variant="outlined" className="flex items-center gap-3">
            <div className="relative shrink-0">
              {user && <GAvatar firstName={user.firstName} lastName={user.lastName} status={user.status} size="sm" shape="circle" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-text-secondary truncate">@{user?.userName}</p>
            </div>

            <GButton onClick={handleLogout} variant="ghost" size="lg" className="!p-3 rounded-xl" title={t.logout} aria-label={t.logout}>
              <GIcon icon={LogOut} size="md" color="inherit" />
            </GButton>
          </GCard>
        </div>
      </footer>
    </div>
  );
}
