"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Bell, Radio } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/hooks/useFavorites"; // Import useFavorites

const navLinks = [
    { href: "/", label: "Accueil", active: true },
    { href: "/programs", label: "Programmes" },
    { href: "/favorites", label: "Favoris" },
    { href: "/charts", label: "Top Charts" },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { favoritesCount } = useFavorites(); // Get favoritesCount

    return (
        <nav className="sticky top-0 z-50 glass border-b">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-red-600 text-white shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                        <Radio className="h-6 w-6" strokeWidth={2.5} />
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-background animate-pulse" />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-bold leading-tight tracking-tight">BambaIba Radio</h1>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Live Platform</p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                pathname === link.href
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                        >
                            {link.label}
                            {/* Favorites badge for desktop */}
                            {link.href === "/favorites" && favoritesCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in fade-in zoom-in duration-300">
                                    {favoritesCount}
                                </span>
                            )}
                            {pathname === link.href && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                        <Search className="h-4 w-4" />
                    </button>

                    <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
                    </button>

                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            {searchOpen && (
                <div className="border-t bg-background/95 backdrop-blur-xl px-4 py-3 animate-in slide-in-from-top-2">
                    <div className="mx-auto max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Rechercher une station, un artiste, un genre..."
                                className="w-full rounded-xl border border-border bg-secondary py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t bg-background px-4 py-4 space-y-1 animate-in slide-in-from-top-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                                pathname === link.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent"
                            )}
                        >
                            {link.label}
                            {/* Favorites badge for mobile */}
                            {link.href === "/favorites" && favoritesCount > 0 && (
                                <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground animate-in fade-in zoom-in duration-300">
                                    {favoritesCount}
                                </span>
                            )}
                        </Link>
                    ))}
                    <div className="pt-2 border-t mt-2">
                        <div className="px-4 py-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
