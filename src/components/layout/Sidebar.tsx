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

// -----------------------------
// ITEMS
// -----------------------------
const mainItems = [
    { href: "/", label: "Découvrir", icon: Home },
    { href: "/live", label: "En Direct", icon: Radio, badge: "12" },
    { href: "/programs", label: "Programmes", icon: Calendar },
    { href: "/favorites", label: "Favoris", icon: Heart, count: 3 },
];

const discoverItems = [
    { href: "/charts", label: "Top Charts", icon: TrendingUp },
    { href: "/genres", label: "Genres", icon: Music2 },
];

const bottomItems = [
    { href: "/settings", label: "Paramètres", icon: Settings },
    { href: "/help", label: "Aide", icon: HelpCircle },
];

// -----------------------------
// SIDEBAR
// -----------------------------
export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r bg-card/50 backdrop-blur-xl">
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">

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
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-4 w-4 transition-colors",
                                    pathname === item.href
                                        ? "text-primary"
                                        : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />

                            <span className="flex-1">{item.label}</span>

                            {item.badge && (
                                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                  {item.badge}
                </span>
                            )}

                            {item.count && (
                                <span className="text-xs text-muted-foreground">{item.count}</span>
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
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "h-4 w-4 transition-colors",
                                pathname === item.href
                                    ? "text-primary"
                                    : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* RECENT */}
                <div className="space-y-1">
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Récemment écoutées
                    </p>

                    {["Radio Nova", "FIP", "France Inter"].map((station) => (
                        <button
                            key={station}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full text-left group"
                        >
                            <div className="h-2 w-2 rounded-full bg-green-500 group-hover:bg-green-400 transition-colors" />
                            {station}
                        </button>
                    ))}
                </div>
            </div>

            {/* BOTTOM */}
            <div className="border-t p-3 space-y-1">
                {bottomItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors group"
                    >
                        <item.icon className="h-4 w-4 transition-colors group-hover:text-foreground" />
                        {item.label}
                    </Link>
                ))}
            </div>
        </aside>
    );
}
