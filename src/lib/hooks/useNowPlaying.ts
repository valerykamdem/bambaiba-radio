"use client";

import useSWR from "swr";
import { AzuraStation } from "@/types/azuracast";
import { AzuraCast } from "@/lib/azuracast";

const REFRESH_INTERVAL = 15000; // 15s pour le polling des listes de stations

export function useAllStations() {
    const { data, error, isLoading } = useSWR<AzuraStation[]>(
        "all-stations",
        () => AzuraCast.getAllNowPlaying(),
        {
            refreshInterval: REFRESH_INTERVAL,
            revalidateOnFocus: true,
            dedupingInterval: 10000, // Ne pas refetch si la même requête est faite dans les 10s
        }
    );

    return {
        stations: data || [],
        isLoading,
        isError: error,
    };
}

export function useLiveStationsCount() {
    const { stations, isLoading, isError } = useAllStations();
    const liveCount = stations.filter(s => s.is_online).length;
    return { liveCount, isLoading, isError };
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
