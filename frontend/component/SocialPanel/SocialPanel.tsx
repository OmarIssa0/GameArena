"use client";

import { Users } from "lucide-react";

import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { useFriends } from "@/hooks/useFriends";
import { en, type TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import { useAside } from "@/hooks/useAside";
import { GIcon } from "@/component/common/GIcon";
import { AsideWrapper } from "@/component/aside/AsideWrapper";
import { AsideHeader } from "@/component/aside/AsideHeader";
import { SocialDesktopCollapsed } from "./SocialDesktopCollapsed";
import { SocialDesktopExpanded } from "./SocialDesktopExpanded";
import type { AsideConfig } from "@/component/aside/AsideTypes";
import type { IUserSummary } from "@/domain/meta/IUserSummary";

function SocialBrand({ onlineCount }: { onlineCount: number }) {
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;

  return (
    <div className="min-w-0">
      <p className="font-bold text-text flex items-center gap-2">
        <GIcon icon={Users} size="sm" color="inherit" className="shrink-0" />
        <span className="truncate">{t.title}</span>
      </p>
      <p className="text-xs text-text-muted">
        {onlineCount} {t.online}
      </p>
    </div>
  );
}

function SocialBody({
  collapsed,
  isDesktop,
  isCompact,
  closeMobile,
  friends,
  onlineCount,
  loading,
  gameInvites,
}: {
  collapsed: boolean;
  isDesktop: boolean;
  isCompact: boolean;
  closeMobile: () => void;
  friends: IUserSummary[];
  onlineCount: number;
  loading: boolean;
  gameInvites: { roomId: string }[];
}) {
  // ── Collapsed rail view (desktop only) ──────────────────────────────────
  if (collapsed && isDesktop) {
    return (
      <div className="flex flex-col h-full">
        {/* Online count summary for collapsed state */}
        <div className="px-3 pt-3 pb-1 text-center">
          <p className="text-xs text-text-muted">{onlineCount}</p>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <SocialDesktopCollapsed friends={friends} isCompact={isCompact} closeMobile={closeMobile} loading={loading} />
        </div>
      </div>
    );
  }

  // ── Expanded full view (desktop expanded or mobile overlay) ────────────
  return (
    <SocialDesktopExpanded
      friends={friends}
      loading={loading}
      gameInvites={gameInvites}
      isCompact={isCompact}
      closeMobile={closeMobile}
    />
  );
}

/**
 * Social panel — right-side panel for friends, invites, and social features.
 *
 * useFriends() is called ONCE here and data is passed as props to children.
 * This prevents SignalR re-invocations when toggling collapsed/expanded.
 */
function SocialPanel() {
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;
  const { gameInvites } = useDashboardNotifications();
  const { friends, loading, onlineCount } = useFriends();
  const aside = useAside(false);

  const collapsedIcon = (
    <span className="relative inline-flex">
      <GIcon icon={Users} size="md" tile tileSize="md" />
      {gameInvites.length > 0 && <span className="absolute -top-1 -inset-e-1 w-2 h-2 rounded-full bg-primary ring-2 ring-bg-sidebar" />}
    </span>
  );

  const asideConfig: AsideConfig = {
    placement: "end",
    expandedWidth: "w-80",
    collapsedWidth: "w-20",
    label: t.friendsAndInvites,
    mobileIcon: collapsedIcon,
  };

  return (
    <AsideWrapper
      config={asideConfig}
      aside={aside}
      header={
        <AsideHeader aside={aside} label={t.friendsAndInvites} brand={<SocialBrand onlineCount={onlineCount} />} collapsedIcon={collapsedIcon} />
      }>
      <SocialBody
        collapsed={aside.collapsed}
        isDesktop={aside.isDesktop}
        isCompact={aside.isCompact}
        closeMobile={aside.closeMobile}
        friends={friends}
        onlineCount={onlineCount}
        loading={loading}
        gameInvites={gameInvites}
      />
    </AsideWrapper>
  );
}

export { SocialPanel };
