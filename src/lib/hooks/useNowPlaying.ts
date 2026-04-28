"use client";

import useSWR from "swr";
import { AzuraStation } from "@/types/azuracast";
import { AzuraCast } from "@/lib/azuracast";

const REFRESH_INTERVAL = 5000; // 5s pour simuler du temps réel

export function useAllStations() {
    const { data, error, isLoading } = useSWR<AzuraStation[]>(
        "all-stations",
        () => AzuraCast.getAllNowPlaying(),
        {
            refreshInterval: REFRESH_INTERVAL,
            revalidateOnFocus: true,
            dedupingInterval: 2000,
        }
    );

    return {
        stations: data || [],
        isLoading,
        isError: error,
    };
}

export function useStation(shortcode: string) {
    const { data, error, isLoading } = useSWR<AzuraStation>(
        shortcode ? `station-${shortcode}` : null,
        () => AzuraCast.getStationNowPlaying(shortcode),
        {
            refreshInterval: REFRESH_INTERVAL,
            revalidateOnFocus: true,
        }
    );

    return {
        station: data,
        isLoading,
        isError: error,
    };
}
