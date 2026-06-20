"use client";

import { ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/Hooks/useTranslation";
import ar from "./i18n/social.ar.i18n";
import en, { TSocialTranslation } from "./i18n/social.en.i18n";

const friends = [
  { name: "Ahmed", status: "Playing Match", rank: 1 },
  { name: "Sara", status: "In Lobby", rank: 2 },
  { name: "Omar", status: "Playing Match", rank: 3 },
];

const statusColor: Record<string, string> = {
  "Playing Match": "text-neon-cyan",
  "In Lobby": "text-neon-magenta",
  "In Match": "text-primary",
  "Online": "text-neon-green",
};

const statusKey: Record<string, keyof TSocialTranslation> = {
  "Playing Match": "playing",
  "In Lobby": "lobby",
  "In Match": "match",
  "Online": "online",
};

function SocialPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TSocialTranslation;

  return (
    <aside className={`hidden lg:flex lg:flex-col shrink-0 bg-bg-sidebar border-l border-border overflow-y-auto ${collapsed ? "w-16" : "w-80"}`}>
      {/* Toggle */}
      <div className={`flex items-center h-16 px-4 border-b border-border ${collapsed ? "justify-center" : "justify-end"}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-text-secondary hover:bg-surface-alt hover:text-text p-2 rounded-lg transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Header */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-neon-green" />
            <h2 className="text-xs font-bold text-text-secondary uppercase">{t.title}</h2>
          </div>
          <p className="text-[11px] text-text-muted">
            {friends.filter((f) => f.status === "Playing Match").length} {t.inMatch}
          </p>
        </div>
      )}

      {/* Friends List */}
      <div className="space-y-1 px-3 py-2 w-full">
        {friends.map((friend) => (
          <button
            key={friend.rank}
            onClick={() => router.push(`/messages?friend=${friend.name}`)}
            className={`flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-alt transition-colors text-left w-full cursor-pointer ${collapsed ? "justify-center" : ""}`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-neon-magenta shrink-0 flex items-center justify-center relative">
              <span className="text-[10px] text-white font-bold">{friend.rank}</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-neon-green border-2 border-bg-sidebar" />
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{friend.name}</p>
                <p className={`text-xs truncate ${statusColor[friend.status] || "text-text-secondary"}`}>
                  {friend.status === "Playing Match" && <Gamepad2 className="inline w-3 h-3 mr-1" />}
                  {t[statusKey[friend.status]] || friend.status}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}

export { SocialPanel };
