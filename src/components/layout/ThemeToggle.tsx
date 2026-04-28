"use client";

import { useTheme } from "next-themes";
// lucide-react icons replaced with emoji fallback for compatibility
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="w-9 h-9" />;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-accent"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <span role="img" aria-label="sun" style={{ fontSize: 14 }}>☀️</span>
            ) : (
                <span role="img" aria-label="moon" style={{ fontSize: 14 }}>🌙</span>
            )}
        </button>
    );
}
