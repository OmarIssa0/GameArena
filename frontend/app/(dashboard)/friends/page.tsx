"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, Search, UserCheck, Users } from "lucide-react";
import { useConnections } from "@/app/providers/ConnectionProvider";
import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TFriendsTranslation } from "./i18n/en.i18n";
import { GTabs } from "@/component/common/GTabs";
import { FriendsTab } from "@/component/friend/FriendsTab";
import { RequestsTab } from "@/component/friend/RequestsTab";
import { SearchTab } from "@/component/friend/SearchTab";
import type { GTabItem } from "@/component/common/def/GTabs";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

type TFriendsTab = "friends" | "requests" | "search";

function FriendsPage() {
  const router = useRouter();
  const { gameConnection: gameHub } = useConnections();
  const t = useTranslation({ en, ar }) as TFriendsTranslation;
  const [activeTab, setActiveTab] = useState<TFriendsTab>("friends");

  const tabs = useMemo<GTabItem<TFriendsTab>[]>(
    () => [
      { id: "friends", label: t.friends, icon: <Users className="h-4 w-4" /> },
      {
        id: "requests",
        label: t.requests,
        icon: <UserCheck className="h-4 w-4" />,
      },
      { id: "search", label: t.search, icon: <Search className="h-4 w-4" /> },
    ],
    [t],
  );

  const handleInvite = async (friendId: string) => {
    if (!gameHub) return;

    try {
      await gameHub.invoke("InviteFriend", friendId, GamesKindEnum.TicTacToe);
    } catch (error) {
      console.error("Invite failed", error);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-bg custom-scrollbar px-4 py-6 sm:px-6 transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 animate-fade-in">
        <header className="rounded-2xl border border-border/60 bg-surface-alt/40 px-5 py-5 sm:px-6 backdrop-blur-md shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between text-start">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-all">
                <Gamepad2 className="h-3.5 w-3.5" />
                {t.community}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-text">
                {t.friends}
              </h1>
              <p className="max-w-2xl text-sm text-text-secondary font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-border/60 bg-surface-alt/20 p-3 shadow-md backdrop-blur-sm sm:p-4">
          <GTabs
            tabs={tabs}
            value={activeTab}
            onChange={setActiveTab}
            variant="pills"
            fullWidth
          >
            <div className="pt-5 text-start">
              {activeTab === "friends" && (
                <FriendsTab
                  onMessage={(id) => router.push(`/messages?friend=${id}`)}
                  onInvite={handleInvite}
                  onNavigateToSearch={() => setActiveTab("search")}
                />
              )}

              {activeTab === "requests" && <RequestsTab />}

              {activeTab === "search" && <SearchTab />}
            </div>
          </GTabs>
        </section>
      </div>
    </div>
  );
}

export default FriendsPage;
