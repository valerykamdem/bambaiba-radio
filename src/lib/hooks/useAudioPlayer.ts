"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface AudioState {
    isPlaying: boolean;
    isLoading: boolean;
    volume: number;
    error: string | null;
    currentTime: number;
    duration: number;
}

export function useAudioPlayer(streamUrl: string | null) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [state, setState] = useState<AudioState>({
        isPlaying: false,
        isLoading: false,
        volume: 0.8,
        error: null,
        currentTime: 0,
        duration: 0,
    });

    useEffect(() => {
        if (!streamUrl) return;

        const audio = new Audio(streamUrl);
        audio.crossOrigin = "anonymous";
        audio.volume = state.volume;
        audioRef.current = audio;

        const updateState = (updates: Partial<AudioState>) =>
            setState((prev) => ({ ...prev, ...updates }));

        audio.addEventListener("loadstart", () => updateState({ isLoading: true, error: null }));
        audio.addEventListener("canplay", () => updateState({ isLoading: false }));
        audio.addEventListener("play", () => updateState({ isPlaying: true }));
        audio.addEventListener("pause", () => updateState({ isPlaying: false }));
        audio.addEventListener("error", () => updateState({
            error: "Erreur de lecture du flux",
            isLoading: false,
            isPlaying: false
        }));
        audio.addEventListener("timeupdate", () => {
            updateState({
                currentTime: audio.currentTime,
                duration: audio.duration || 0
            });
        });

        audio.play().catch((e) => updateState({ error: e.message }));

        return () => {
            audio.pause();
            audio.src = "";
            audioRef.current = null;
        };
    }, [streamUrl]);

    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;
        if (audioRef.current.paused) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, []);

    const setVolume = useCallback((vol: number) => {
        if (audioRef.current) {
            audioRef.current.volume = vol;
            setState((prev) => ({ ...prev, volume: vol }));
        }
    }, []);

    return {
        ...state,
        togglePlay,
        setVolume,
        audioElement: audioRef.current,
    };
}
