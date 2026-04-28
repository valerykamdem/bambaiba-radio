import { AzuraStation, SongHistory, StationSchedule } from "@/types/azuracast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005/api";
const API_KEY = process.env.AZURACAST_API_KEY;

class AzuraAPIError extends Error {
    constructor(message: string, public status: number) {
        super(message);
        this.name = "AzuraAPIError";
    }
}

async function fetcher<T>(url: string): Promise<T> {
    const res = await fetch(`${API_BASE}${url}`, {
        headers: {
            Accept: "application/json",
        ...(API_KEY ? { "Authorization": `Bearer ${API_KEY}` } : {}),
        },
        next: { revalidate: 0 }, // Données temps réel
    });

    if (!res.ok) {
        console.error(`Erreur ${res.status} sur ${url}: ${res.statusText}`);
        throw new AzuraAPIError(`Erreur API: ${res.statusText}`, res.status);
    }

    return res.json();
}

export const AzuraCast = {
    // Toutes les stations en live
    getAllNowPlaying: () => fetcher<AzuraStation[]>("/nowplaying"),

    // Station spécifique
    getStationNowPlaying: (shortcode: string) =>
        fetcher<AzuraStation>(`/nowplaying/${shortcode}`),

    // Historique d'une station
    getStationHistory: (shortcode: string) =>
        fetcher<SongHistory[]>(`/station/${shortcode}/history`),

    // Programme/Schedule
    getStationSchedule: (shortcode: string) =>
        fetcher<StationSchedule[]>(`/station/${shortcode}/schedule`),

    // Statuts serveurs (admin)
    getStationStatus: (shortcode: string) =>
        fetcher(`/station/${shortcode}/status`),
};
