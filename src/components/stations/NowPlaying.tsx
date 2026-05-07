"use client";

import Image from "next/image";
import { Clock, Disc3, Mic2, Play, Pause, Activity } from "lucide-react";
import { AzuraStation } from "@/types/azuracast";
import { usePlayer } from "@/lib/hooks/usePlayer";
import { useEffect, useState, useRef } from "react"; // Import useRef
import { AzuraCast } from "@/lib/azuracast";
import { cn } from "@/lib/utils";

interface NowPlayingProps {
    station: AzuraStation;
}

export function NowPlayingDetail({ station: initialStation }: NowPlayingProps) {
    const { currentStation, setCurrentStation, isPlaying, togglePlay, isLoading } = usePlayer();
    const [station, setStation] = useState(initialStation);

    // Ref pour stocker la dernière valeur de 'station' sans la mettre en dépendance de l'effet
    const latestStationRef = useRef(station);

    // Mettre à jour la ref chaque fois que 'station' change
    useEffect(() => {
        latestStationRef.current = station;
    }, [station]);

    const isThisStation = currentStation?.shortcode === station.station.shortcode;
    const isThisPlaying = isThisStation && isPlaying;

    // Mise à jour des données de la station via polling
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const updated = await AzuraCast.getStationNowPlaying(station.station.shortcode);
                setStation(prev => {
                    if (prev.now_playing?.song?.title === updated.now_playing?.song?.title &&
                        prev.now_playing?.song?.artist === updated.now_playing?.song?.artist) {
                        return prev;
                    }
                    return updated;
                });
            } catch (e) {
                console.error("Failed to update station info via polling", e);
            }
        }, 15000);

        return () => clearInterval(interval);
    }, [station.station.shortcode]);

    // Si c'est la station en cours d'écoute, synchroniser avec les données du player
    useEffect(() => {
        if (isThisStation && currentStation?.song) {
            // Utiliser la ref pour la comparaison afin d'éviter l'avertissement ESLint
            const currentSongInStation = latestStationRef.current.now_playing?.song;
            const currentSongInPlayer = currentStation.song;

            // Mettre à jour uniquement si la chanson du player global est différente
            if (currentSongInStation?.title !== currentSongInPlayer.title ||
                currentSongInStation?.artist !== currentSongInPlayer.artist) {

                setStation(prev => ({
                    ...prev,
                    now_playing: {
                        ...(prev.now_playing || {}),
                        song: {
                            ...((prev.now_playing && prev.now_playing.song) || {}),
                            ...currentStation.song
                        }
                    }
                }));
            }
        }
    }, [isThisStation, currentStation?.song]); // 'station' n'est plus une dépendance directe ici

    const { now_playing, playing_next, live } = station;
    const current = now_playing?.song;
    const next = playing_next?.song;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handlePlayAction = () => {
        if (isThisStation) {
            togglePlay();
        } else {
            setCurrentStation({
                shortcode: station.station.shortcode,
                name: station.station.name,
                listenUrl: station.station.listen_url || "",
                art: current?.art,
                song: current ? {
                    title: current.title,
                    artist: current.artist,
                    art: current.art
                } : undefined
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Current Track - Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 via-accent to-background p-6 md:p-8 border border-border">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="group relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl shadow-2xl md:h-48 md:w-48">
                        <Image
                            src={current?.art || "/default-art.jpg"}
                            alt={current?.title || "Cover"}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={handlePlayAction}
                                className="h-16 w-16 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transform transition-transform hover:scale-110 active:scale-95"
                            >
                                {isLoading && isThisStation ? (
                                    <div className="h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : isThisPlaying ? (
                                    <Pause className="h-8 w-8 fill-current" />
                                ) : (
                                    <Play className="h-8 w-8 fill-current ml-1" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            {live?.is_live && (
                                <div className="inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white animate-pulse">
                                    <Mic2 className="h-4 w-4" />
                                    LIVE : {live.streamer_name}
                                </div>
                            )}
                            {isThisPlaying && (
                                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary border border-primary/20">
                                    <Activity className="h-4 w-4 animate-bounce" />
                                    ÉCOUTE EN COURS
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-foreground md:text-4xl tracking-tight">
                                {current?.title || "Titre inconnu"}
                            </h2>
                            <p className="text-xl text-muted-foreground mt-1">
                                {current?.artist || "Artiste inconnu"}
                            </p>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-4 space-y-2 max-w-md">
                            <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                <span>{formatTime(now_playing?.elapsed || 0)}</span>
                                <span>{formatTime(now_playing?.duration || 0)}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-secondary/50">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                    style={{
                                        width: `${((now_playing?.elapsed || 0) / (now_playing?.duration || 1)) * 100}%`
                                    }}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={handlePlayAction}
                                className={cn(
                                    "flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all shadow-lg",
                                    isThisPlaying
                                        ? "bg-secondary text-foreground hover:bg-secondary/80"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                                )}
                            >
                                {isThisPlaying ? (
                                    <><Pause className="h-5 w-5 fill-current" /> ARRÊTER L'ÉCOUTE</>
                                ) : (
                                    <><Play className="h-5 w-5 fill-current" /> ÉCOUTER MAINTENANT</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Track */}
            {next && (
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 group hover:bg-accent/50 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            À suivre
                        </p>
                        <p className="font-semibold text-foreground">
                            {next.title} <span className="text-muted-foreground font-normal mx-2">—</span> {next.artist}
                        </p>
                    </div>
                    <Disc3 className="h-6 w-6 text-muted-foreground animate-spin-slow group-hover:text-primary transition-colors" />
                </div>
            )}
        </div>
    );
}
