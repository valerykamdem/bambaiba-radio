"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayerControls } from "@/components/player/playerControls";
import { VolumeSlider } from "@/components/player/VolumeSlider";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/lib/hooks/usePlayer";
import { Heart, X, Maximize2, Minimize2 } from "lucide-react";
import { useFavorites } from "@/lib/hooks/useFavorites";

export default function GlobalPlayer() {
    const { 
        currentStation, 
        setCurrentStation, 
        isPlaying, 
        isLoading, 
        volume, 
        togglePlay, 
        setVolume 
    } = usePlayer();
    
    const { isFavorite, toggleFavorite } = useFavorites();
    const [expanded, setExpanded] = useState(false);

    if (!currentStation) return null;

    const coverArt = currentStation.song?.art || currentStation.art || "/default-art.jpg";
    const currentStationShortcode = currentStation.shortcode;
    const isCurrentStationFavorite = isFavorite(currentStationShortcode);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            {/* Vue étendue */}
            {expanded && (
                <div className="absolute bottom-full left-0 right-0 bg-card/95 backdrop-blur-3xl border-t border-border p-6 shadow-2xl animate-in slide-in-from-bottom-4">
                    <div className="mx-auto max-w-2xl flex flex-col items-center text-center">
                        <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-2xl overflow-hidden shadow-2xl mb-8 group">
                            <Image
                                src={coverArt}
                                alt={currentStation.name}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-2 mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                                {currentStation.song?.title || "En direct"}
                            </h2>
                            <p className="text-lg md:text-xl text-primary font-medium">
                                {currentStation.song?.artist || currentStation.name}
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wider">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                                </span>
                                {currentStation.name}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Barre de lecture principale */}
            <div className="glass border-t bg-background/95 backdrop-blur-2xl">
                <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
                    {/* Infos Station/Titre */}
                    <div className="flex items-center gap-3 min-w-0 flex-1 group">
                        <button 
                            onClick={() => setExpanded(!expanded)}
                            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl shadow-md"
                        >
                            <Image
                                src={coverArt}
                                alt={currentStation.name}
                                fill
                                unoptimized
                                className="object-cover transition-transform group-hover:scale-105"
                            />

                            {isPlaying && (
                                <div className="absolute inset-0 flex items-end justify-center gap-0.5 pb-1 bg-black/30">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-white rounded-full animate-equalizer"
                                            style={{
                                                height: "40%",
                                                animationDelay: `${i * 0.15}s`,
                                                animationDuration: `${0.6 + i * 0.2}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </button>

                        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                            <p className="truncate font-bold text-foreground group-hover:text-primary transition-colors">
                                {currentStation.song?.title || currentStation.name}
                            </p>
                            <p className="truncate text-sm text-muted-foreground">
                                {currentStation.song?.artist || "Radio en direct"}
                            </p>
                        </div>
                    </div>

                    {/* Contrôles Centraux */}
                    <div className="flex flex-col items-center gap-1">
                        <PlayerControls
                            isPlaying={isPlaying}
                            isLoading={isLoading}
                            onTogglePlay={togglePlay}
                        />
                    </div>

                    {/* Actions & Volume */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => toggleFavorite(currentStationShortcode)}
                            className={cn(
                                "hidden sm:flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-accent",
                                isCurrentStationFavorite ? "text-red-500" : "text-muted-foreground"
                            )}
                        >
                            <Heart className={cn("h-5 w-5", isCurrentStationFavorite && "fill-current")} />
                        </button>

                        <div className="hidden md:flex items-center">
                            <VolumeSlider volume={volume} onChange={setVolume} />
                        </div>

                        <div className="flex items-center border-l pl-3 gap-1">
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                                {expanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                            </button>
                            <button
                                onClick={() => setCurrentStation(null)}
                                className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
