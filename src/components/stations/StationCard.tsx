"use client";

import Image from "next/image";
import Link from "next/link";
import { Radio, Users, Play, Activity } from "lucide-react";
import { AzuraStation } from "@/types/azuracast";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/lib/hooks/usePlayer";

interface StationCardProps {
    station: AzuraStation;
}

export function StationCard({ station }: StationCardProps) {
    const { currentStation, setCurrentStation, isPlaying: globalIsPlaying } = usePlayer();
    
    const { station: info, now_playing, listeners, is_online } = station;
    const song = now_playing?.song;
    
    const isThisStationPlaying = currentStation?.shortcode === info.shortcode;
    const isPlaying = isThisStationPlaying && globalIsPlaying;

    const handlePlay = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isThisStationPlaying) {
            // Si c'est déjà cette station, on ne fait rien ou on pourrait toggle via usePlayer
            // Mais pour la consistance on laisse le GlobalPlayer gérer le toggle
            return;
        }

        // On utilise l'URL de flux direct s'il y en a une, sinon le premier mount point
        const listenUrl = info.listen_url || station.links.listen || "";
        
        setCurrentStation({
            shortcode: info.shortcode,
            name: info.name,
            listenUrl: listenUrl,
            art: song?.art,
            song: song ? {
                title: song.title,
                artist: song.artist,
                art: song.art
            } : undefined
        });
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
            {/* Image / Cover */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                    src={song?.art || "/default-art.jpg"}
                    alt={info.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />

                {/* Live badge */}
                {is_online && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                        </span>
                        LIVE
                    </div>
                )}

                {/* Play button */}
                <button
                    onClick={handlePlay}
                    className={cn(
                        "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                        isThisStationPlaying && "opacity-100"
                    )}
                >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
                        {isPlaying ? (
                            <Activity className="h-6 w-6 animate-pulse" />
                        ) : (
                            <Play className={cn("h-6 w-6 fill-current ml-1", isThisStationPlaying && "animate-pulse")} />
                        )}
                    </div>
                </button>

                {/* Listeners count */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm" aria-label="listeners">
                    <Users className="h-3 w-3" />
                    {listeners.current || listeners.total || 0}
                </div>
            </div>

            {/* Content */}
            <Link href={`/stations/${info.shortcode}`} className="flex flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                            {info.name}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                            {info.description || "Radio en direct"}
                        </p>
                    </div>
                    <Radio className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isThisStationPlaying ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )} />
                </div>

                {/* Now Playing */}
                <div className="mt-3 rounded-lg bg-secondary/50 p-2.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        En cours
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                        {song?.title || "Inconnu"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                        {song?.artist || "Artiste inconnu"}
                    </p>
                </div>
            </Link>
        </div>
    );
}
