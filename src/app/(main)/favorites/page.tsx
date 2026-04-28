"use client";

import Image from "next/image";
import Link from "next/link";
import { useAllStations } from "@/lib/hooks/useNowPlaying";
import { cn } from "@/lib/utils";
import { Heart, Trash2, Headphones, Play, Pause, Activity, Share2 } from "lucide-react";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { usePlayer } from "@/lib/hooks/usePlayer";

export default function FavoritesPage() {
    const { stations, isLoading: isStationsLoading } = useAllStations();
    const { favorites, removeFavorite, clearFavorites, favoritesCount } = useFavorites();
    const { currentStation, setCurrentStation, isPlaying: globalIsPlaying, togglePlay } = usePlayer();

    const favoriteStations = stations.filter(s =>
        favorites.some(f => f.shortcode === s.station.shortcode)
    );

    const getAddedDate = (shortcode: string) => {
        const fav = favorites.find(f => f.shortcode === shortcode);
        return fav ? new Date(fav.addedAt).toLocaleDateString("fr-FR") : "";
    };

    const handlePlayStation = (station: any) => {
        const isCurrent = currentStation?.shortcode === station.station.shortcode;
        if (isCurrent) {
            togglePlay();
        } else {
            setCurrentStation({
                shortcode: station.station.shortcode,
                name: station.station.name,
                listenUrl: station.station.listen_url || station.links.listen || "",
                art: station.now_playing?.song?.art,
                song: station.now_playing?.song ? {
                    title: station.now_playing.song.title,
                    artist: station.now_playing.song.artist,
                    art: station.now_playing.song.art,
                } : undefined,
            });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Mes Favoris</h1>
                    <p className="mt-2 text-muted-foreground flex items-center gap-2">
                        <Heart className="h-4 w-4 text-primary fill-primary" />
                        {favoritesCount} station{favoritesCount > 1 ? "s" : ""} enregistrée{favoritesCount > 1 ? "s" : ""}
                    </p>
                </div>
                {favoritesCount > 0 && (
                    <button
                        onClick={() => {
                            if (confirm("Voulez-vous vraiment supprimer tous vos favoris ?")) {
                                clearFavorites();
                            }
                        }}
                        className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive hover:text-white transition-all active:scale-95"
                    >
                        <Trash2 className="h-4 w-4" />
                        Tout supprimer
                    </button>
                )}
            </div>

            {/* Empty State */}
            {!isStationsLoading && favoritesCount === 0 && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 py-24 px-6 text-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                            <Heart className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold">Votre collection est vide</h3>
                    <p className="mt-2 text-muted-foreground max-w-sm">
                        Vous n'avez pas encore ajouté de stations à vos favoris. Parcourez la liste pour trouver vos radios préférées.
                    </p>
                    <Link
                        href="/"
                        className="mt-8 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                        Découvrir les stations
                    </Link>
                </div>
            )}

            {/* Favorites Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favoriteStations.map((station) => {
                    const isCurrent = currentStation?.shortcode === station.station.shortcode;
                    const isPlaying = isCurrent && globalIsPlaying;

                    return (
                        <div
                            key={station.station.shortcode}
                            className={cn(
                                "group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
                                isCurrent && "border-primary/50 ring-1 ring-primary/20"
                            )}
                        >
                            {/* Image Header */}
                            <div className="relative aspect-video overflow-hidden">
                                <Image
                                    src={station.now_playing?.song?.art || "/default-art.jpg"}
                                    alt={station.station.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                                
                                <button
                                    onClick={() => handlePlayStation(station)}
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-110">
                                        {isPlaying ? (
                                            <Pause className="h-6 w-6 fill-current" />
                                        ) : (
                                            <Play className="h-6 w-6 fill-current ml-1" />
                                        )}
                                    </div>
                                </button>

                                {isPlaying && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground backdrop-blur-md">
                                        <Activity className="h-3 w-3 animate-pulse" />
                                        LECTURE
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col p-4">
                                <Link href={`/stations/${station.station.shortcode}`}>
                                    <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                        {station.station.name}
                                    </h3>
                                </Link>
                                <p className="text-xs text-muted-foreground truncate mt-1">
                                    {station.now_playing?.song?.title || "Radio en direct"}
                                </p>

                                <div className="mt-4 flex items-center justify-between gap-2 border-t pt-3">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                            <Headphones className="h-3 w-3" />
                                            {station.listeners.current || 0} auditeurs
                                        </div>
                                        <span className="text-[10px] text-muted-foreground/60 mt-0.5 italic">
                                            Ajouté le {getAddedDate(station.station.shortcode)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => removeFavorite(station.station.shortcode)}
                                            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            title="Retirer des favoris"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                            title="Partager"
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
