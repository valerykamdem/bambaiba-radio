"use client";

import { StationCard } from "./StationCard";
import { AzuraStation } from "@/types/azuracast";
import { cn } from "@/lib/utils";

interface StationGridProps {
    stations: AzuraStation[];
    columns?: 2 | 3 | 4 | 5;
    className?: string;
    playingStation?: string | null;
    onPlayStation?: (shortcode: string, listenUrl: string) => void;
}

export function StationGrid({
    stations,
    columns = 4,
    className,
    playingStation,
    onPlayStation,
}: StationGridProps) {
    // Prevent unused prop errors when props are provided by parent components
    void playingStation;
    void onPlayStation;
    const gridCols = {
        2: "sm:grid-cols-2",
        3: "sm:grid-cols-2 lg:grid-cols-3",
        4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        5: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    };

    return (
        <div className={cn("grid gap-5", gridCols[columns], className)}>
            {stations.map((station) => (
                <StationCard
                    key={station.station.shortcode}
                    station={station}
                />
            ))}
        </div>
    );
}
