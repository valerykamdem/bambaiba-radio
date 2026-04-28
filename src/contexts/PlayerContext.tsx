"use client";

import { createContext, useState, ReactNode, useEffect, useCallback, useRef, useMemo } from "react";
import { AzuraCast } from "@/lib/azuracast";

export interface PlayerSong {
    title: string;
    artist: string;
    art?: string;
}

export interface PlayerStation {
    shortcode: string;
    name: string;
    listenUrl: string;
    art?: string;
    song?: PlayerSong;
}

interface PlayerContextType {
    currentStation: PlayerStation | null;
    setCurrentStation: (station: PlayerStation | null) => void;
    isPlaying: boolean;
    isLoading: boolean;
    volume: number;
    togglePlay: () => void;
    setVolume: (vol: number) => void;
}

export const PlayerContext = createContext<PlayerContextType>({
    currentStation: null,
    setCurrentStation: () => {},
    isPlaying: false,
    isLoading: false,
    volume: 0.8,
    togglePlay: () => {},
    setVolume: () => {},
});

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [currentStation, setCurrentStationState] = useState<PlayerStation | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [volume, setVolumeState] = useState(0.8);
    
    // Le moteur audio est persistant et ne change jamais
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 1. Initialisation UNIQUE du moteur audio
    useEffect(() => {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.preload = "none"; // Ne pas charger avant le clic
        audioRef.current = audio;
        
        const handlers = {
            loadstart: () => setIsLoading(true),
            waiting: () => setIsLoading(true),
            canplay: () => setIsLoading(false),
            playing: () => { setIsLoading(false); setIsPlaying(true); },
            pause: () => setIsPlaying(false),
            error: () => { setIsLoading(false); setIsPlaying(false); }
        };

        Object.entries(handlers).forEach(([event, handler]) => audio.addEventListener(event, handler));

        return () => {
            Object.entries(handlers).forEach(([event, handler]) => audio.removeEventListener(event, handler));
            audio.pause();
            audio.src = "";
        };
    }, []);

    // 2. Mise à jour du Volume
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    // 3. Moteur de métadonnées (Texte/Image) - TOTALEMENT INDÉPENDANT DU SON
    const updateMetadata = useCallback(async (shortcode: string) => {
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        
        try {
            const data = await AzuraCast.getStationNowPlaying(shortcode);
            if (data?.now_playing) {
                const { song, remaining } = data.now_playing;
                
                // On met à jour l'UI uniquement
                setCurrentStationState(prev => {
                    if (!prev || prev.shortcode !== shortcode) return prev;
                    if (prev.song?.title === song.title) return prev;
                    return { ...prev, song: { title: song.title, artist: song.artist, art: song.art } };
                });

                // Calcul intelligent du prochain check (minimum 15s)
                const nextCheck = Math.max(15000, (remaining * 1000) + 3000);
                refreshTimerRef.current = setTimeout(() => {
                    if (document.visibilityState === "visible") updateMetadata(shortcode);
                }, nextCheck);
            }
        } catch (e) {
            refreshTimerRef.current = setTimeout(() => updateMetadata(shortcode), 30000);
        }
    }, []);

    // 4. Actions de lecture (Sans toucher aux métadonnées au début pour la vitesse)
    const setCurrentStation = useCallback((station: PlayerStation | null) => {
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

        if (!station) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
            setCurrentStationState(null);
            return;
        }

        const audio = audioRef.current;
        if (audio) {
            const isDifferent = audio.src !== station.listenUrl;
            if (isDifferent) {
                audio.pause();
                audio.src = station.listenUrl;
                audio.load();
            }
            audio.play().catch(() => {
                // Fallback si le stream a expiré
                audio.src = station.listenUrl;
                audio.play();
            });
        }

        setCurrentStationState(station);
        updateMetadata(station.shortcode);
    }, [updateMetadata]);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || !currentStation) return;

        if (audio.paused) {
            audio.play().catch(() => {
                audio.src = currentStation.listenUrl;
                audio.play();
            });
            updateMetadata(currentStation.shortcode);
        } else {
            audio.pause();
        }
    }, [currentStation, updateMetadata]);

    // Optimisation des rendus
    const contextValue = useMemo(() => ({
        currentStation,
        setCurrentStation,
        isPlaying,
        isLoading,
        volume,
        togglePlay,
        setVolume: setVolumeState
    }), [currentStation, setCurrentStation, isPlaying, isLoading, volume, togglePlay]);

    return (
        <PlayerContext.Provider value={contextValue}>
            {children}
        </PlayerContext.Provider>
    );
}
