"use client";

import { useTheme } from "next-themes";
// lucide-react icons replaced with emoji fallbacks for compatibility
import { Monitor, Bell, Volume2, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold">Paramètres</h1>
                <p className="mt-2 text-muted-foreground">Personnalisez votre expérience RadioStream</p>
            </div>

            {/* Appearance */}
            <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Monitor className="h-5 w-5" /> Apparence
                </h2>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { key: "light", label: "Clair" },
                        { key: "dark", label: "Sombre" },
                        { key: "system", label: "Système" },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTheme(t.key)}
                            className={cn(
                                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                                theme === t.key
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border hover:border-accent"
                            )}
                        >
                            <span role="img" aria-label={t.label} style={{ fontSize: 24 }}>🔘</span>
                            <span className="text-sm font-medium">{t.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Notifications */}
            <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Bell className="h-5 w-5" /> Notifications
                </h2>

                {[
                    { label: "Nouvelles stations", desc: "Alerte quand une station démarre", default: true },
                    { label: "Programmes favoris", desc: "Rappel avant vos émissions", default: true },
                    { label: "Mises à jour", desc: "Nouvelles fonctionnalités", default: false },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <button className={cn(
                            "relative h-6 w-11 rounded-full transition-colors",
                            item.default ? "bg-primary" : "bg-muted"
                        )}>
              <span className={cn(
                  "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                  item.default ? "left-6" : "left-1"
              )} />
                        </button>
                    </div>
                ))}
            </section>

            {/* Audio */}
            <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Volume2 className="h-5 w-5" /> Audio
                </h2>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span>Qualité par défaut</span>
                        <span className="font-medium">128 kbps</span>
                    </div>
                    <div className="flex gap-2">
                        {["64", "128", "192", "320"].map((kbps) => (
                            <button
                                key={kbps}
                                className={cn(
                                    "flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
                                    kbps === "128"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {kbps}k
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Connection */}
            <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Wifi className="h-5 w-5" /> Connexion
                </h2>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Serveur AzuraCast</p>
                    <code className="block rounded-lg bg-secondary px-3 py-2 text-sm font-mono">
                        http://localhost:8005/api
                    </code>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-sm text-green-600 font-medium">Connecté</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
