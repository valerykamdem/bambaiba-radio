"use client";

import { useState, useEffect } from "react";
// lucide-react icons replaced with emoji fallbacks for compatibility
import Image from "next/image";
import Link from "next/link";
import { AzuraStation } from "@/types/azuracast";
import { useAllStations } from "@/lib/hooks/useNowPlaying";
import { cn } from "@/lib/utils";
import {Heart, Trash2} from "lucide-react";

interface FavoriteStation {
    shortcode: string;
    addedAt: number;
}

export default function FavoritesPage() {
    const { stations } = useAllStations();
    const [favorites, setFavorites] = useState<FavoriteStation[]>([]);
    const [playingStation, setPlayingStation] = useState<string | null>(null);

    // Load favorites from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("radio-favorites");
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch {
                setFavorites([]);
            }
        }
    }, []);

    // Save favorites
    useEffect(() => {
        localStorage.setItem("radio-favorites", JSON.stringify(favorites));
    }, [favorites]);

    const removeFavorite = (shortcode: string) => {
        setFavorites(prev => prev.filter(f => f.shortcode !== shortcode));
    };

    const favoriteStations = stations.filter(s =>
        favorites.some(f => f.shortcode === s.station.shortcode)
    );

    const getAddedDate = (shortcode: string) => {
        const fav = favorites.find(f => f.shortcode === shortcode);
        return fav ? new Date(fav.addedAt).toLocaleDateString("fr-FR") : "";
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Favoris</h1>
                    <p className="mt-2 text-muted-foreground">
                        {favoriteStations.length} station{favoriteStations.length > 1 ? "s" : ""} enregistrée
                        {favoriteStations.length > 1 ? "s" : ""}
                    </p>
                </div>
                {favorites.length > 0 && (
                    <button
                        onClick={() => {
                            if (confirm("Voulez-vous vraiment supprimer tous vos favoris ?")) {
                                setFavorites([]);
                            }
                        }}
                        className="flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        Tout supprimer
                    </button>
                )}
            </div>

            {/* Empty State */}
            {favoriteStations.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 py-20">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                        <Heart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">Aucun favori</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">
                        Ajoutez des stations à vos favoris pour y accéder rapidement depuis cette page
                    </p>
                    <Link
                        href="/"
                        className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Découvrir les stations
                    </Link>
                </div>
            )}

            {/* Favorites Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteStations.map((station) => (
                    <div
                        key={station.station.shortcode}
                        className="group relative flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                        {/* Cover */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                            <Image
                                src={station.now_playing?.song?.art || "/default-art.jpg"}
                                alt={station.station.name}
                                fill
                                className="object-cover"
                            />
                            <button
                                onClick={() => setPlayingStation(
                                    playingStation === station.station.shortcode ? null : station.station.shortcode
                                )}
                                className={cn(
                                    "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity",
                                    playingStation === station.station.shortcode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                )}
                            >
                                {playingStation === station.station.shortcode ? (
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-1 bg-white rounded-full animate-equalizer" style={{ height: '40%', animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>
                                ) : (
                                    <span role="img" aria-label="play" style={{ fontSize: 14 }}>▶</span>
                                )}
                            </button>
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                            <Link href={`/stations/${station.station.shortcode}`}>
                                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                    {station.station.name}
                                </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground truncate mt-0.5">
                                {station.now_playing?.song?.title || "En direct"}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-muted-foreground" aria-label="listeners">
                  <span role="img" aria-label="listeners-icon" style={{ fontSize: 12 }}>🎧</span>
                    {station.listeners.current || 0} auditeurs
                </span>
                                <span className="text-xs text-muted-foreground">
                  Ajouté le {getAddedDate(station.station.shortcode)}
                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => removeFavorite(station.station.shortcode)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                title="Retirer des favoris"
                            >
                                <span role="img" aria-label="trash" style={{ fontSize: 12 }}>🗑️</span>
                            </button>
                            <button
                                onClick={() => {/* share */}}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                title="Partager"
                            >
                                <span role="img" aria-label="heart" style={{ fontSize: 12 }}>❤️</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
