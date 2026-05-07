"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Home,
    Radio,
    Calendar,
    Heart,
    TrendingUp,
    Music2,
    Settings,
    HelpCircle
} from "lucide-react";
import { useLiveStationsCount } from "@/lib/hooks/useNowPlaying";
import { useFavorites } from "@/lib/hooks/useFavorites";

// -----------------------------
// SIDEBAR
// -----------------------------
export function Sidebar() {
    const pathname = usePathname();
    const { liveCount } = useLiveStationsCount();
    const { favoritesCount } = useFavorites();

    const mainItems = [
        { href: "/", label: "Découvrir", icon: Home },
        { href: "/live", label: "En Direct", icon: Radio, badge: liveCount > 0 ? liveCount.toString() : null },
        { href: "/programs", label: "Programmes", icon: Calendar },
        { href: "/favorites", label: "Favoris", icon: Heart, count: favoritesCount },
    ];

    const discoverItems = [
        { href: "/charts", label: "Top Charts", icon: TrendingUp },
        { href: "/genres", label: "Genres", icon: Music2 },
    ];

    const bottomItems = [
        { href: "/settings", label: "Paramètres", icon: Settings },
        { href: "/help", label: "Aide", icon: HelpCircle },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-border bg-card/70 backdrop-blur-xl">
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">

                {/* MAIN */}
                <div className="space-y-1">
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Menu
                    </p>

                    {mainItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-5 w-5 transition-colors",
                                    pathname === item.href
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />

                            <span className="flex-1">{item.label}</span>

                            {item.badge && (
                                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white text-primary px-1.5 text-[10px] font-bold animate-in fade-in zoom-in duration-300">
                                    {item.badge}
                                </span>
                            )}

                            {item.count !== undefined && item.count > 0 && (
                                <span className="text-xs font-semibold text-primary-foreground bg-primary px-2 py-0.5 rounded-full animate-in fade-in zoom-in duration-300">
                                    {item.count}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>

                {/* DISCOVER */}
                <div className="space-y-1">
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Explorer
                    </p>

                    {discoverItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-colors",
                                pathname === item.href
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* BOTTOM */}
            <div className="border-t border-border p-4 space-y-1">
                {bottomItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                            pathname === item.href
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                    >
                        <item.icon className={cn(
                            "h-5 w-5 transition-colors",
                            pathname === item.href
                                ? "text-primary-foreground"
                                : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        {item.label}
                    </Link>
                ))}
            </div>
        </aside>
    );
}
