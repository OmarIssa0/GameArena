"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { ArrowRight, Gamepad2, MessageSquare, Users, Trophy, Zap, Sparkles } from "lucide-react";
import { GIcon } from "@/component/common/GIcon";
import { GList } from "@/component/common/GList";
import { ar } from "./i18n/ar.i18n";
import { en, type THomeTranslation } from "./i18n/en.i18n";
import { GamesList } from "@/domain/constant/games";
import { RecentHistorySection } from "@/component/history/RecentHistorySection";
import { GPage } from "@/component/common/GPage";
import { GCard } from "@/component/common/GCard";
import { GButton } from "@/component/common/GButton";
import { GBadge } from "@/component/common/GBadge";
import { GameCard } from "@/component/games/common/GameCard";
import { useRouter } from "next/navigation";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

function Home() {
  const { user } = useAuth();
  const t = useTranslation({ en, ar }) as THomeTranslation;
  const { friendRequestCount, unreadMessageCount } = useDashboardNotifications();
  const router = useRouter();

  const handleGameSelect = (path: string) => {
    router.push(`/games/${path}`);
  };

  const stats = [
    { label: t.stats.gamesAvailable, value: GamesList.length, icon: Gamepad2, gradient: "bg-primary", href: "/games" },
    { label: t.stats.unreadMessages, value: unreadMessageCount, icon: MessageSquare, gradient: "bg-success", href: "/messages" },
    { label: t.stats.friendRequests, value: friendRequestCount, icon: Users, gradient: "bg-warning", href: "/friends?tab=requests" },
  ];

  const features = [
    { icon: Zap, title: t.features.instantPlay, desc: t.features.instantPlayDesc },
    { icon: Users, title: t.features.playWithFriends, desc: t.features.playWithFriendsDesc },
    { icon: Trophy, title: t.features.rankedMatches, desc: t.features.rankedMatchesDesc },
    { icon: Sparkles, title: t.features.seasonalEvents, desc: t.features.seasonalEventsDesc },
  ];

  return (
    <GPage size={SizeEnum.xl} className="py-6 sm:py-8 lg:py-10">
      {/* Hero Section */}
      <section className="mb-10 lg:mb-14 animate-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <GIcon icon={Gamepad2} size={SizeEnum.lg} tile color={AccentColorEnum.OnPrimary} />
            <div className="min-w-0">
               <GBadge variant={AccentColorEnum.Primary} className="mb-2 text-xs">
                {t.features.badge}
              </GBadge>
              <p className="text-sm font-medium text-primary truncate">{t.welcome(user?.firstName || "")}</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
                {t.brand}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:ms-auto">
            <Link href="/games">
              <GButton size={SizeEnum.lg} startIcon={<GIcon icon={Gamepad2} size={SizeEnum.md} />}>
                {t.playNow}
              </GButton>
            </Link>
            <Link href="/history">
              <GButton variant={AccentColorEnum.Text} size={SizeEnum.lg} startIcon={<GIcon icon={Trophy} size={SizeEnum.md} />}>
                {t.viewStats}
              </GButton>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <GList items={stats} keyExtractor={(stat) => stat.label} noPagination listClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {({ label, value, icon: Icon, gradient, href }) => (
            <Link href={href} className="group">
              <GCard
                variant={CardVariantEnum.Interactive}
                className="flex items-center gap-4 p-4 transition-all duration-300 group-hover:-translate-y-1 h-full">
                <GIcon
                  icon={Icon}
                  size={SizeEnum.md}
                  tile
                  tileGradient={gradient}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-2xl sm:text-3xl font-black text-primary">{value}</p>
                  <p className="mt-1 truncate text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
                </div>
                <GIcon
                  icon={ArrowRight}
                  size={SizeEnum.sm}
                  color={AccentColorEnum.Muted}
                  className="group-hover:text-primary group-hover:translate-x-1 rtl:-translate-x-1 transition-all duration-200"
                />
              </GCard>
            </Link>
          )}
        </GList>
      </section>

      {/* Features Section */}
      <section className="mb-10 lg:mb-14 animate-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
             <GBadge variant={AccentColorEnum.Secondary} className="mb-2 text-xs">
              {t.features.badge}
            </GBadge>
            <h2 className="text-2xl sm:text-3xl font-bold text-text">{t.features.title}</h2>
          </div>
        </div>
        <GList items={features} keyExtractor={(feature) => feature.title} listClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" noPagination>
          {({ icon, title, desc }) => (
            <GCard
              variant={CardVariantEnum.Glass}
              padding={SizeEnum.lg}
              className="group text-center transition-all duration-300 group-hover:border-primary/50 h-full">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <GIcon icon={icon} size={SizeEnum.lg} color={AccentColorEnum.Primary} />
              </div>
              <h3 className="text-lg font-bold text-text mb-1">{title}</h3>
              <p className="text-sm text-text-secondary">{desc}</p>
            </GCard>
          )}
        </GList>
      </section>

      {/* Recent History */}
      <RecentHistorySection
        title={t.recentHistory.title}
        viewAll={t.recentHistory.viewAll}
        emptyTitle={t.recentHistory.emptyTitle}
        emptyDescription={t.recentHistory.emptyDescription}
      />

      {/* Games Grid */}
      <section className="mt-8 lg:mt-12 animate-in" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <GBadge variant={AccentColorEnum.Primary} className="mb-2 text-xs">
              {t.enterArena}
            </GBadge>
            <h2 className="text-2xl sm:text-3xl font-bold text-text">{t.gamesAvailable}</h2>
          </div>
        </div>
        <GList items={[...GamesList]} keyExtractor={(game) => `${game.type}`} listClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" noPagination>
          {(game) => (
            <GameCard
              name={t.games[game.name as keyof typeof t.games]}
              desc={t.games[game.description as keyof typeof t.games]}
              icon={game.icon}
              gradientClass={game.gradientClass}
              animation={game.animation}
              onClick={() => handleGameSelect(game.path)}
              playLabel={t.playNow}
              page
            />
          )}
        </GList>
      </section>
    </GPage>
  );
}

export default Home;
