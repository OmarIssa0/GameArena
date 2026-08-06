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
import { statusColor } from "@/domain/constant/status-color";
import clsx from "clsx";
import { SocialPanelTabEnum } from "@/domain/enum/SocialPanelTabEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { AvatarShapeEnum } from "@/domain/enum/AvatarShapeEnum";
import type { ISocialDesktopCollapsedProps } from "./def/SocialDesktopCollapsed";

function SocialDesktopCollapsed({ friends, isCompact, closeMobile, loading }: ISocialDesktopCollapsedProps) {
  const router = useRouter();
  const { gameInvites, dismissGameInvite, acceptGameInvite } = useDashboardNotifications();
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;
  const [activeTab, setActiveTab] = useState<SocialPanelTabEnum>(SocialPanelTabEnum.Friends);

  const goToChat = (id: string) => {
    router.push(`/messages?friend=${id}`);
    if (isCompact) closeMobile();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-3">
        <GSpinner size={SizeEnum.md} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Vertical tabs */}
      <div className="flex flex-col gap-1 px-2 pt-2">
        <GButton
          variant={activeTab === SocialPanelTabEnum.Friends ? AccentColorEnum.Primary : AccentColorEnum.Muted}
          size={SizeEnum.icon}
          onClick={() => setActiveTab(SocialPanelTabEnum.Friends)}
          className="w-full h-9 justify-center"
          aria-label={t.tabs.friends}>
          <GIcon icon={Users} size={SizeEnum.sm} />
        </GButton>
        <GButton
          variant={activeTab === SocialPanelTabEnum.Invites ? AccentColorEnum.Primary : AccentColorEnum.Muted}
          size={SizeEnum.icon}
          onClick={() => setActiveTab(SocialPanelTabEnum.Invites)}
          className="w-full h-9 justify-center relative"
          aria-label={t.tabs.invites}>
          <GIcon icon={Bell} size={SizeEnum.sm} />
          {gameInvites.length > 0 && <span className="absolute -top-0.5 -end-0.5 w-2 h-2 rounded-full bg-danger ring-1 ring-bg-sidebar" />}
        </GButton>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-2 py-2">
        {activeTab === SocialPanelTabEnum.Invites ? (
          <GList
            items={gameInvites}
            keyExtractor={(invite) => invite.roomId}
            emptyMessage=""
            emptyDescription={t.noInvitesDescription}
            emptyIcon={<GIcon icon={Bell} size={SizeEnum.sm} color={AccentColorEnum.Muted} />}>
              {(invite) => (
                <div className="bg-primary-muted border border-primary/20 rounded-xl p-2 text-center">
                  <p className="text-2xs font-medium text-text leading-tight mb-1.5 truncate">
                    {t.invites.wantsToPlay.replace("{{name}}", invite.inviterName ?? "")}
                  </p>
                  <div className="flex gap-1 justify-center">
                    <GButton size={SizeEnum.xs} className="text-2xs" onClick={() => acceptGameInvite(invite.roomId)}>
                      {t.invites.accept}
                    </GButton>
                    <GButton
                      size={SizeEnum.xs}
                      variant={AccentColorEnum.Secondary}
                      className="text-2xs"
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
            emptyIcon={<GIcon icon={Users} size={SizeEnum.sm} color={AccentColorEnum.Muted} />}>
            {(f) => (
              <GButton
                type="button"
                onClick={() => goToChat(f.id)}
                title={`${f.firstName ?? ""} ${f.lastName ?? ""}`.trim() || (f.userName ?? undefined)}
                className="relative shrink-0 w-10 h-10 rounded-full transition hover:ring-2 hover:ring-primary focus-visible:ring-2 focus-visible:ring-primary outline-none">
                <GAvatar firstName={f.firstName} lastName={f.lastName} status={f.status} size={SizeEnum.sm} shape={AvatarShapeEnum.Circle} />
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
