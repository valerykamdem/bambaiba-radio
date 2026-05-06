"use client";

import { Activity } from "lucide-react";
import { StationGrid } from "@/components/stations/StationGrid";
import { useAllStations } from "@/lib/hooks/useNowPlaying";

export default function LivePage() {
    const { stations } = useAllStations();

    const liveStations = stations.filter(s => s.is_online);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                    <Activity className="h-6 w-6 text-red-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Direct Live</h1>
                    <p className="text-muted-foreground">{liveStations.length} stations en streaming</p>
                </div>
            </div>

            <StationGrid
                stations={liveStations}
                columns={4}
            />
        </div>
    );
}
