import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AzuraCast } from "@/lib/azuracast";
import { NowPlayingDetail } from "@/components/stations/NowPlaying";
import { ListenerCount } from "@/components/stations/ListenerCount";
import { StationHistory } from "@/components/stations/StationHistory";
import { Metadata } from "next";

// Next.js 16 : params est async
interface Props {
    params: Promise<{ shortcode: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { shortcode } = await params;
    try {
        const station = await AzuraCast.getStationNowPlaying(shortcode);
        return {
            title: `${station.station.name} — RadioStream`,
            description: station.station.description || `Écoutez ${station.station.name} en direct`,
        };
    } catch {
        return { title: "Station non trouvée" };
    }
}

export default async function StationPage({ params }: Props) {
    const { shortcode } = await params;

    let station;
    try {
        station = await AzuraCast.getStationNowPlaying(shortcode);
    } catch {
        notFound();
    }

    return (
        <div className="space-y-8">
            {/* Header Station */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-bold tracking-tight">
                            {station.station.name}
                        </h1>
                        {station.is_online && (
                            <span className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                EN DIRECT
              </span>
                        )}
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        {station.station.description}
                    </p>
                </div>

                <div className="md:ml-auto">
                    <ListenerCount
                        total={station.listeners.total}
                        unique={station.listeners.unique}
                    />
                </div>
            </div>

            {/* Now Playing */}
            <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-muted" />}>
                <NowPlayingDetail station={station} />
            </Suspense>

            {/* Stream Info */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Historique</h2>
                    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
                        <StationHistory shortcode={shortcode} />
                    </Suspense>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Flux audio</h2>
                    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                        {station.station.mounts.map((mount) => (
                            <div
                                key={mount.id}
                                className="flex items-center justify-between rounded-lg bg-secondary p-3"
                            >
                                <div>
                                    <p className="font-medium">{mount.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {mount.bitrate}kbps {mount.format.toUpperCase()}
                                    </p>
                                </div>
                                <audio controls className="h-8 w-32" src={mount.url}>
                                    <track kind="captions" />
                                </audio>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
