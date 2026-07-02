"use client";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { Gamepad2, ArrowRight, MessagesSquare, UserPlus } from "lucide-react";
import { ar } from "./i18n/ar.i18n";
import { en, type THomeTranslation } from "./i18n/en.i18n";
import { games } from "@/domain/constant/games";

function getGreeting(t: THomeTranslation) {
  const hour = new Date().getHours();
  if (hour < 12) return t.greeting.morning;
  if (hour < 18) return t.greeting.afternoon;
  return t.greeting.evening;
}

function Home() {
  const { user } = useAuth();
  const t = useTranslation({ en, ar }) as THomeTranslation;
  const { friendRequestCount, unreadMessageCount } =
    useDashboardNotifications();

  const stats = [
    {
      label: t.stats.gamesAvailable,
      value: games.length,
      icon: Gamepad2,
      color: "text-primary",
    },
    {
      label: t.stats.unreadMessages,
      value: unreadMessageCount,
      icon: MessagesSquare,
      color: "text-neon-cyan",
      href: "/messages",
    },
    {
      label: t.stats.friendRequests,
      value: friendRequestCount,
      icon: UserPlus,
      color: "text-neon-magenta",
      href: "/friends",
    },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-5 sm:px-8 py-8 sm:py-10">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="icon-tile w-11 h-11 bg-linear-to-br from-primary to-neon-magenta">
            <Gamepad2 className="w-5 h-5 text-text" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary truncate">
              {getGreeting(t)}
              {user?.firstName ? `, ${user.firstName}` : ""}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              <span className="bg-linear-to-r from-text via-purple-200 to-zinc-400 bg-clip-text text-transparent">
                Game
              </span>
              <span className="bg-linear-to-r from-neon-cyan via-primary to-neon-magenta bg-clip-text text-transparent">
                Arena
              </span>
            </h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {stats.map(({ label, value, icon: Icon, color, href }) => {
            const card = (
              <div className="stat-card">
                <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                <div className="min-w-0">
                  <p className="text-xl font-bold text-text leading-none">
                    {value}
                  </p>
                  <p className="text-xs text-text-muted mt-1 truncate">
                    {label}
                  </p>
                </div>
              </div>
            );
            return href ? (
              <Link key={label} href={href}>
                {card}
              </Link>
            ) : (
              <div key={label}>{card}</div>
            );
          })}
        </div>

        {/* Games */}
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
          {t.enterArena}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.name}
                href={game.path}
                className="surface-card group flex items-center gap-4 p-4 hover:border-primary/50 transition-colors"
              >
                <div
                  className={`icon-tile w-12 h-12 bg-linear-to-br ${game.gradient}`}
                >
                  <Icon className="w-6 h-6 text-text" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-text font-bold text-base">{game.name}</h3>
                  <p className="text-text-secondary text-sm truncate">
                    {game.desc}
                  </p>
                </div>
                <ArrowRight
                  className={`w-5 h-5 ${game.color} shrink-0 transition-transform group-hover:translate-x-1`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Home;
