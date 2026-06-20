"use client";
import { Gamepad2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/Hooks/useTranslation";
import ar from "./i18n/ar.i18n";
import en, { TFriendsTranslation } from "./i18n/en.i18n";

const friends = [
  { name: "Ahmed", status: "Playing Match", avatar: "https://i.pravatar.cc/150?img=1" },
  { name: "Sara", status: "In Lobby", avatar: "https://i.pravatar.cc/150?img=5" },
  { name: "Omar", status: "Playing Match", avatar: "https://i.pravatar.cc/150?img=11" },
];

const statusKey: Record<string, keyof TFriendsTranslation> = {
  "Playing Match": "playing",
  "In Lobby": "lobby",
  "In Match": "match",
  "Online": "online",
};

const statusColor: Record<string, string> = {
  "Playing Match": "text-neon-cyan",
  "In Lobby": "text-neon-magenta",
  "In Match": "text-primary",
  "Online": "text-neon-green",
};

const statusDot: Record<string, string> = {
  "Playing Match": "bg-neon-cyan",
  "In Lobby": "bg-neon-magenta",
  "In Match": "bg-primary",
  "Online": "bg-neon-green",
};

export default function Friends() {
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TFriendsTranslation;

  return (
    <div className="h-full relative z-10 px-4 sm:px-8 py-6">
      <h1 className="text-2xl font-bold text-white mb-6">{t.title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {friends.map((friend) => (
          <div key={friend.name} className="bg-bg-card border border-border rounded-xl p-5 flex flex-col items-center text-center">
            <div className="relative mb-3">
              <img src={friend.avatar} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ${statusDot[friend.status]} border-2 border-bg-card`} />
            </div>
            <h3 className="text-white font-semibold text-base">{friend.name}</h3>
            <p className={`text-xs mt-0.5 mb-4 ${statusColor[friend.status]}`}>{t[statusKey[friend.status]]}</p>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => router.push(`/messages?friend=${friend.name}`)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                {t.message}
              </button>
              <button
                onClick={() => router.push("/games")}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-text text-sm font-medium hover:bg-surface-alt transition-colors cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                {t.invite}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
