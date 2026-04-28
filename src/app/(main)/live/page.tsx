"use client";

import { Activity } from "lucide-react";
import { StationGrid } from "@/components/stations/StationGrid";
import { useAllStations } from "@/lib/hooks/useNowPlaying";
// import { usePlayer } from "../layout";
import { usePlayer } from "@/lib/hooks/usePlayer";
import { useState } from "react";

export default function LivePage() {
    const { stations, isLoading } = useAllStations();
    const { setCurrentStation } = usePlayer();
    const [playing, setPlaying] = useState<string | null>(null);

    const liveStations = stations.filter(s => s.is_online);

    const handlePlay = (shortcode: string, listenUrl: string) => {
        const station = stations.find(s => s.station.shortcode === shortcode);
        if (!station) return;

        if (playing === shortcode) {
            setPlaying(null);
            setCurrentStation(null);
        } else {
            setPlaying(shortcode);
            setCurrentStation({
                shortcode,
                name: station.station.name,
                listenUrl,
                art: station.now_playing?.song?.art,
                song: station.now_playing?.song ? {
                    title: station.now_playing.song.title,
                    artist: station.now_playing.song.artist,
                    art: station.now_playing.song.art,
                } : undefined,
            });
        }
    };

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
                playingStation={playing}
                onPlayStation={handlePlay}
                columns={4}
            />
        </div>
    );
}
