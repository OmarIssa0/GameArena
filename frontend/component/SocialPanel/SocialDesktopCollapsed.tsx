"use client";

import { useState } from "react";
import { Users, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { GIcon } from "@/component/common/GIcon";
import { GAvatar } from "../common/GAvatar";
import { GButton } from "../common/GButton";
import { GList } from "../common/GList";
import { GSpinner } from "../common/GSpinner";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import clsx from "clsx";
import type { IUserSummary } from "@/domain/meta/IUserSummary";

interface SocialDesktopCollapsedProps {
  friends: IUserSummary[];
  isCompact: boolean;
  closeMobile: () => void;
  loading?: boolean;
}

type CollapsedTab = "friends" | "invites";

const statusColor: Partial<Record<UserStatusEnum, string>> = {
  [UserStatusEnum.Online]: "bg-success",
  [UserStatusEnum.InGame]: "bg-primary",
  [UserStatusEnum.Offline]: "bg-text-muted",
};

function SocialDesktopCollapsed({ friends, isCompact, closeMobile, loading }: SocialDesktopCollapsedProps) {
  const router = useRouter();
  const { gameInvites, dismissGameInvite, acceptGameInvite } = useDashboardNotifications();
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;
  const [activeTab, setActiveTab] = useState<CollapsedTab>("friends");

  const goToChat = (id: string) => {
    router.push(`/messages?friend=${id}`);
    if (isCompact) closeMobile();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-3">
        <GSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Vertical tabs */}
      <div className="flex flex-col gap-1 px-2 pt-2">
        <GButton
          variant={activeTab === "friends" ? "primary" : "ghost"}
          size="icon"
          onClick={() => setActiveTab("friends")}
          className="w-full min-h-[36px] justify-center"
          aria-label={t.tabs.friends}>
          <GIcon icon={Users} size="sm" color="inherit" />
        </GButton>
        <GButton
          variant={activeTab === "invites" ? "primary" : "ghost"}
          size="icon"
          onClick={() => setActiveTab("invites")}
          className="w-full min-h-[36px] justify-center relative"
          aria-label={t.tabs.invites}>
          <GIcon icon={Bell} size="sm" color="inherit" />
          {gameInvites.length > 0 && (
            <span className="absolute -top-0.5 -end-0.5 w-2 h-2 rounded-full bg-danger ring-1 ring-bg-sidebar" />
          )}
        </GButton>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-2 py-2">
        {activeTab === "invites" ? (
          <GList
            items={gameInvites}
            keyExtractor={(invite) => invite.roomId}
            emptyMessage=""
            emptyDescription={t.noInvitesDescription}
            emptyIcon={<GIcon icon={Bell} size="sm" color="muted" />}>
            {(invite) => (
              <div className="bg-primary-muted border border-primary/20 rounded-xl p-2 text-center">
                <p className="text-[10px] font-medium text-text leading-tight mb-1.5 truncate">
                  {t.invites.wantsToPlay.replace("{{name}}", invite.inviterName ?? "")}
                </p>
                <div className="flex gap-1 justify-center">
                  <GButton size="icon" className="min-w-[32px] min-h-[28px] text-[10px] px-2" onClick={() => acceptGameInvite(invite.roomId)}>
                    {t.invites.accept}
                  </GButton>
                  <GButton
                    size="icon"
                    variant="secondary"
                    className="min-w-[32px] min-h-[28px] text-[10px] px-2"
                    onClick={() => dismissGameInvite(invite.roomId)}>
                    {t.invites.decline}
                  </GButton>
                </div>
              </div>
            )}
          </GList>
        ) : (
          <GList
            items={friends}
            keyExtractor={(f) => f.id}
            emptyMessage=""
            emptyDescription={t.noFriendsDescription}
            emptyIcon={<GIcon icon={Users} size="sm" color="muted" />}>
            {(f) => (
              <GButton
                type="button"
                onClick={() => goToChat(f.id)}
                title={`${f.firstName ?? ""} ${f.lastName ?? ""}`.trim() || (f.userName ?? undefined)}
                className="relative shrink-0 min-w-[40px] min-h-[40px] rounded-full transition hover:ring-2 hover:ring-primary focus-visible:ring-2 focus-visible:ring-primary outline-none">
                <GAvatar firstName={f.firstName} lastName={f.lastName} status={f.status} size="sm" shape="circle" />
                <span
                  className={clsx(
                    "absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full ring-1 ring-bg-sidebar",
                    (f.status !== undefined ? statusColor[f.status] : undefined) ?? "bg-text-muted",
                  )}
                />
              </GButton>
            )}
          </GList>
        )}
      </div>
    </div>
  );
}

export { SocialDesktopCollapsed };
