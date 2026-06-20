"use client";
import { useTranslation } from "@/Hooks/useTranslation";
import { Gamepad2, ArrowRight, Orbit, Puzzle, Swords } from "lucide-react";
import Link from "next/link";
import ar from "./i18n/ar.i18n";
import en, { THomeTranslation } from "./i18n/en.i18n";

const games = [
    {
        name: "Snake", path: "/snake", desc: "Classic arcade — eat & survive",
        icon: Orbit, gradient: "from-emerald-400 via-neon-green to-emerald-300",
        color: "text-neon-green",
    },
    {
        name: "Tic Tac Toe", path: "/tic-tac-toe", desc: "3×3 tactical duel",
        icon: Puzzle, gradient: "from-cyan-400 via-neon-cyan to-cyan-300",
        color: "text-neon-cyan",
    },
    {
        name: "Pong", path: "/pong", desc: "Retro table tennis",
        icon: Swords, gradient: "from-violet-400 via-neon-magenta to-violet-300",
        color: "text-neon-magenta",
    },
];

export default function Home() {
    const t = useTranslation({ en, ar }) as THomeTranslation;
    return (
        <div className="flex items-start justify-center h-full px-8 pt-12">
            <div className="w-full max-w-lg">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-neon-magenta flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-1">
                        <span className="bg-gradient-to-r from-white via-purple-200 to-zinc-400 bg-clip-text text-transparent">Game</span>
                        <span className="bg-gradient-to-r from-neon-cyan via-primary to-neon-magenta bg-clip-text text-transparent">Arena</span>
                    </h1>
                    <p className="text-text-secondary text-sm">{t.enterArena}</p>
                </div>
                <div className="flex flex-col gap-3">
                    {games.map((game) => {
                        const Icon = game.icon;
                        return (
                            <Link key={game.name} href={game.path} className="flex items-center gap-4 bg-bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center shrink-0`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-bold text-base">{game.name}</h3>
                                    <p className="text-text-secondary text-sm">{game.desc}</p>
                                </div>
                                <ArrowRight className={`w-5 h-5 ${game.color} shrink-0`} />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
