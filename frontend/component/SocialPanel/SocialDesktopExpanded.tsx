"use client";

import { Users, Bell, UsersRound, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import { GameInvitesList } from "./GameInvitesList";
import { FriendsList } from "./FriendsList";
import { GTabs } from "@/component/common/GTabs";
import { GEmpty } from "../common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { GTextField } from "../common/GTextField";
import { GSpinner } from "../common/GSpinner";
import type { GTabItem } from "@/component/common/def/GTabs";
import { SocialPanelTabEnum } from "@/domain/enum/SocialPanelTabEnum";
import { TabsVariantEnum } from "@/domain/enum/TabsVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import type { ISocialDesktopExpandedProps } from "./def/SocialDesktopExpanded";

function SocialDesktopExpanded({ friends, loading, gameInvites, isCompact, closeMobile }: ISocialDesktopExpandedProps) {
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SocialPanelTabEnum>(SocialPanelTabEnum.Friends);

  const filteredFriends = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((f) => `${f.firstName ?? ""} ${f.lastName ?? ""} ${f.userName ?? ""}`.toLowerCase().includes(term));
  }, [friends, query]);

  const tabs = useMemo<GTabItem<SocialPanelTabEnum>[]>(
    () => [
      { id: SocialPanelTabEnum.Friends, label: t.tabs.friends, icon: <GIcon icon={Users} size={SizeEnum.sm} /> },
      {
        id: SocialPanelTabEnum.Invites,
        label: t.tabs.invites,
        icon: <GIcon icon={Bell} size={SizeEnum.sm} />,
        badge: gameInvites.length || undefined,
      },
    ],
    [t, gameInvites.length],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-bg-sidebar px-4 pt-4">
        <GTabs tabs={tabs} value={activeTab} onChange={setActiveTab} variant={TabsVariantEnum.Pills} fullWidth />

        {activeTab === SocialPanelTabEnum.Friends && (
          <div className="pt-4 pb-2">
            <GTextField
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              startIcon={<GIcon icon={Search} size={SizeEnum.sm} color={AccentColorEnum.Muted} />}
            />
          </div>
        )}
      </div>

      <div className="flex-1 p-4 space-y-4">
        {activeTab === SocialPanelTabEnum.Invites ? (
          <GameInvitesList onAfterAccept={() => isCompact && closeMobile()} />
        ) : loading ? (
          <div className="flex justify-center py-8">
            <GSpinner size={SizeEnum.lg} />
          </div>
        ) : filteredFriends.length === 0 ? (
          <GEmpty
            icon={<GIcon icon={UsersRound} size={SizeEnum.lg} color={AccentColorEnum.Muted} />}
            title={t.noFriendsTitle}
            description={t.noFriendsDescription}
          />
        ) : (
          <FriendsList friends={filteredFriends} query={query} noPagination />
        )}
      </div>
    </div>
  );
}

export { SocialDesktopExpanded };
