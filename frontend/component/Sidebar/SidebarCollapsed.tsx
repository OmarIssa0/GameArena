"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { useConnections } from "@/app/providers/ConnectionProvider";
import { authService } from "@/services/def/AuthService";
import { sidebarNav } from "@/domain/constant/sidebarNav";
import { ar } from "@/component/i18n/SideBar/ar.i18n";
import { en, type TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { GAvatar } from "@/component/common/GAvatar";
import { LangTheme } from "@/component/LangTheme";

export function SidebarCollapsed({ closeMobile }: { closeMobile?: () => void }) {
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
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`relative flex items-center justify-center w-11 h-11 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                ${isActive ? "bg-primary-muted text-primary" : "text-text-secondary hover:bg-primary-muted hover:text-text"}`}
              aria-label={t[id as keyof TSidebarTranslation] ?? id}
              title={t[id as keyof TSidebarTranslation] ?? id}
              aria-current={isActive ? "page" : undefined}>
              <GIcon icon={Icon} size="md" color="inherit" />
              {badgeCount > 0 && <span className="absolute top-1.5 inset-x-0 mx-auto w-2 h-2 rounded-full bg-primary ring-2 ring-bg-sidebar" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-3 px-2 pb-safe pb-3">
        <LangTheme collapsed />

        {user && (
          <button
            onClick={() => handleNav("settings")}
            className="relative flex items-center justify-center w-11 h-11 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label={t.settings}
            title={t.settings}>
            <GAvatar firstName={user.firstName} lastName={user.lastName} status={user.status} size="sm" shape="circle" />
          </button>
        )}

        <GButton onClick={handleLogout} variant="ghost" size="icon" title={t.logout} aria-label={t.logout} className="w-11 h-11">
          <GIcon icon={LogOut} size="md" color="inherit" />
        </GButton>
      </div>
    </div>
  );
}
