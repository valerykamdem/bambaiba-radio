"use client";

import { useState, useMemo, useEffect } from "react";
import { StationGrid } from "@/components/stations/StationGrid";
import { usePlayer } from "@/lib/hooks/usePlayer";
import { useAllStations } from "@/lib/hooks/useNowPlaying";
import { cn } from "@/lib/utils";
import { Radio, Zap, Headphones, TrendingUp } from "lucide-react";

export default function HomeClient({ initialStations }: { initialStations: any[] }) {
    const { currentStation, setCurrentStation } = usePlayer();
    const [filter, setFilter] = useState<"all" | "live" | "popular">("all");

    // Utilisation de SWR pour mettre à jour les infos des stations en arrière-plan sans recharger la page
    const { stations: updatedStations, isLoading: isPolling } = useAllStations();
    
    // On utilise les données mises à jour si disponibles, sinon les initiales
    const stations = updatedStations.length > 0 ? updatedStations : initialStations;

    const handlePlay = (shortcode: string, listenUrl: string) => {
        const station = stations.find((s) => s.station.shortcode === shortcode);
        if (!station) return;

        if (currentStation?.shortcode === shortcode) return;

        setCurrentStation({
            shortcode,
            name: station.station.name,
            listenUrl,
            art: station.now_playing?.song?.art,
            song: station.now_playing?.song ? {
                title: station.now_playing.song.title,
                artist: station.now_playing.song.artist,
                art: station.now_playing.song.art,
            } : undefined,
        });
    };

    const filteredStations = useMemo(() => {
        return stations.filter((station) => {
            if (filter === "live") return station.is_online;
            if (filter === "popular") return (station.listeners.current || 0) > 50;
            return true;
        });
    }, [stations, filter]);

    const sortedStations = useMemo(() => {
        return [...filteredStations].sort((a, b) => {
            if (a.is_online !== b.is_online) return b.is_online ? 1 : -1;
            return (b.listeners.current || 0) - (a.listeners.current || 0);
        });
    }, [filteredStations]);

    const onlineCount = useMemo(() => stations.filter((s) => s.is_online).length, [stations]);
    const totalListeners = useMemo(() => stations.reduce((acc, s) => acc + (s.listeners.current || 0), 0), [stations]);

    return (
        <div className="space-y-10">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-accent to-background border border-primary/10 p-8 lg:p-12">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                        <Zap className="h-4 w-4" />
                        Plateforme en temps réel
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                        Vos radios, <span className="text-primary">en direct</span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                        Découvrez et écoutez {stations.length} stations en streaming live.
                    </p>
                </div>
            </section>

            {/* Stats Bar */}
            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    { icon: Radio, value: onlineCount, label: "En ligne", color: "text-primary", bg: "bg-primary/10" },
                    { icon: Headphones, value: totalListeners, label: "Auditeurs", color: "text-green-500", bg: "bg-green-500/10" },
                    { icon: TrendingUp, value: stations.length, label: "Total", color: "text-blue-500", bg: "bg-blue-500/10" },
                ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 group">
                        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", stat.bg)}>
                            <stat.icon className={cn("h-6 w-6", stat.color)} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stations Grid */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Stations</h2>
                    <div className="flex gap-1 bg-secondary rounded-lg p-1">
                        {["all", "live", "popular"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                    filter === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <StationGrid
                    stations={sortedStations}
                    playingStation={currentStation?.shortcode || null}
                    onPlayStation={handlePlay}
                    columns={4}
                />
            </section>
        </div>
    );
}
