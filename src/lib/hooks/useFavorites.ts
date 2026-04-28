"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bambaiba_favorites";

interface FavoriteItem {
    shortcode: string;
    addedAt: number;
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    // Charger les favoris au montage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error("Erreur chargement favoris", e);
                setFavorites([]); // Réinitialiser en cas d'erreur de parsing
            }
        }
    }, []);

    const toggleFavorite = useCallback((shortcode: string) => {
        setFavorites((prev) => {
            const isAlreadyFavorite = prev.some(item => item.shortcode === shortcode);
            let next: FavoriteItem[];

            if (isAlreadyFavorite) {
                next = prev.filter((item) => item.shortcode !== shortcode);
            } else {
                next = [...prev, { shortcode, addedAt: Date.now() }];
            }
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const isFavorite = useCallback((shortcode: string) => {
        return favorites.some(item => item.shortcode === shortcode);
    }, [favorites]);

    const getFavoriteItem = useCallback((shortcode: string) => {
        return favorites.find(item => item.shortcode === shortcode);
    }, [favorites]);

    const removeFavorite = useCallback((shortcode: string) => {
        setFavorites((prev) => {
            const next = prev.filter(item => item.shortcode !== shortcode);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const clearFavorites = useCallback(() => {
        setFavorites([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        favorites,
        toggleFavorite,
        isFavorite,
        getFavoriteItem,
        removeFavorite,
        clearFavorites,
        favoritesCount: favorites.length
    };
}
