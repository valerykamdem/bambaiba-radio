import { ArrowDownRight, ArrowUpRight, Clock, Headphones, Radio, TrendingUp, Users } from "lucide-react";
import { connection } from "next/server";
import { ListenerChart } from "@/components/charts/ListenerChart";
import { AzuraCast } from "@/lib/azuracast";
import { AzuraStation, SongHistory } from "@/types/azuracast";

type ListenerPoint = {
    time: string;
    listeners: number;
    unique: number;
};

type StationRank = {
    name: string;
    listeners: number;
    unique: number;
    isOnline: boolean;
};

async function getStations() {
    try {
        return await AzuraCast.getAllNowPlaying();
    } catch (error) {
        console.error("Impossible de charger les données top charts:", error);
        return [];
    }
}

async function getStationHistories(stations: AzuraStation[]) {
    const end = new Date();
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

    const results = await Promise.allSettled(
        stations.map(async (station) => ({
            shortcode: station.station.shortcode,
            history: await AzuraCast.getStationHistory(station.station.shortcode, {
                start: start.toISOString(),
                end: end.toISOString(),
            }),
        }))
    );

    return results
        .filter((result): result is PromiseFulfilledResult<{ shortcode: string; history: SongHistory[] }> =>
            result.status === "fulfilled"
        )
        .map((result) => result.value);
}

function getHourBucket(timestamp: number) {
    const date = new Date(timestamp * 1000);
    date.setMinutes(0, 0, 0);

    return date.getTime();
}

function formatHour(timestamp: number) {
    return new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        hour12: false,
        timeZone: "Europe/Berlin",
    }).format(new Date(timestamp));
}

function buildListenerChart(
    historiesByStation: Array<{ shortcode: string; history: SongHistory[] }>
): ListenerPoint[] {
    const stationHourlyValues = new Map<string, Map<number, number[]>>();

    for (const { shortcode, history } of historiesByStation) {
        const hourlyValues = new Map<number, number[]>();

        for (const item of history) {
            const listeners = item.listeners_end ?? item.listeners_start;
            if (typeof listeners !== "number") continue;

            const hourBucket = getHourBucket(item.played_at);
            hourlyValues.set(hourBucket, [...(hourlyValues.get(hourBucket) ?? []), listeners]);
        }

        if (hourlyValues.size > 0) stationHourlyValues.set(shortcode, hourlyValues);
    }

    const hours = Array.from(
        new Set(Array.from(stationHourlyValues.values()).flatMap((stationHours) => Array.from(stationHours.keys())))
    ).sort((a, b) => a - b);

    return hours.map((hourBucket) => {
        const listeners = Array.from(stationHourlyValues.values()).reduce((total, stationHours) => {
            const values = stationHours.get(hourBucket);
            if (!values?.length) return total;

            return total + Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
        }, 0);

        return {
            time: `${formatHour(hourBucket)}h`,
            listeners,
            unique: listeners,
        };
    });
}

function WaitingState({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/30 p-8 text-center">
            <Clock className="mb-3 h-8 w-8 text-muted-foreground" />
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

export default async function ChartsPage() {
    await connection();

    const stations = await getStations();
    const historiesByStation = stations.length > 0 ? await getStationHistories(stations) : [];
    const chartData = buildListenerChart(historiesByStation);

    const rankedStations: StationRank[] = stations
        .map((station) => ({
            name: station.station.name,
            listeners: station.listeners.current ?? station.listeners.total ?? 0,
            unique: station.listeners.unique ?? 0,
            isOnline: station.is_online,
        }))
        .sort((a, b) => {
            if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
            return b.listeners - a.listeners;
        });

    const totalListeners = stations.reduce((total, station) => total + (station.listeners.current ?? 0), 0);
    const uniqueListeners = stations.reduce((total, station) => total + (station.listeners.unique ?? 0), 0);
    const onlineStations = stations.filter((station) => station.is_online).length;
    const peakPoint = chartData.reduce<ListenerPoint | null>(
        (peak, point) => (!peak || point.listeners > peak.listeners ? point : peak),
        null
    );

    const stats = [
        {
            label: "Auditeurs actuels",
            value: totalListeners.toLocaleString("fr-FR"),
            detail: "Temps réel",
            icon: Headphones,
        },
        {
            label: "Auditeurs uniques",
            value: uniqueListeners.toLocaleString("fr-FR"),
            detail: "AzuraCast",
            icon: Users,
        },
        {
            label: "Pic observé",
            value: peakPoint ? peakPoint.listeners.toLocaleString("fr-FR") : "En attente",
            detail: peakPoint ? `${peakPoint.time}` : "Historique requis",
            icon: TrendingUp,
        },
        {
            label: "Stations actives",
            value: stations.length > 0 ? `${onlineStations}/${stations.length}` : "En attente",
            detail: stations.length > 0 ? `${Math.round((onlineStations / stations.length) * 100)}%` : "API requise",
            icon: Radio,
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Top Charts & Statistiques</h1>
                <p className="mt-2 text-muted-foreground">
                    Analyse de l&apos;audience et tendances d&apos;écoute depuis AzuraCast
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
                        <div className="flex items-start justify-between gap-4">
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <stat.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="mt-2">
                            <span className="text-2xl font-bold">{stat.value}</span>
                            <p className="mt-1 text-sm text-muted-foreground">{stat.detail}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Audience sur 24h</h2>
                        <p className="text-sm text-muted-foreground">
                            Données issues de l&apos;historique réel des stations
                        </p>
                    </div>
                    <span className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-muted-foreground">
                        24h
                    </span>
                </div>

                {chartData.length > 0 ? (
                    <ListenerChart data={chartData} height={350} />
                ) : (
                    <WaitingState
                        title={"En attente de données d'audience"}
                        description={
                            "Le graphique sera affiché dès que l'API retournera des points d'historique avec les compteurs d'auditeurs."
                        }
                    />
                )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="border-b border-border p-6">
                    <h2 className="text-lg font-semibold">Classement des Stations</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Par nombre d&apos;auditeurs en temps réel</p>
                </div>

                {rankedStations.length > 0 ? (
                    <div className="divide-y divide-border">
                        {rankedStations.map((station, index) => (
                            <div
                                key={station.name}
                                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-accent/50"
                            >
                                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                                    index === 0 ? "bg-yellow-500/10 text-yellow-600" :
                                        index === 1 ? "bg-gray-400/10 text-gray-600" :
                                            index === 2 ? "bg-orange-700/10 text-orange-700" :
                                                "bg-secondary text-muted-foreground"
                                }`}>
                                    {index + 1}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate font-medium">{station.name}</h3>
                                    <div className="mt-0.5 flex items-center gap-2">
                                        <Headphones className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {station.listeners.toLocaleString("fr-FR")} auditeurs
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="hidden text-sm text-muted-foreground sm:inline">
                                        {station.unique.toLocaleString("fr-FR")} uniques
                                    </span>
                                    <div className={`flex items-center gap-1 text-sm font-medium ${
                                        station.isOnline ? "text-green-500" : "text-red-500"
                                    }`}>
                                        {station.isOnline ? (
                                            <ArrowUpRight className="h-4 w-4" />
                                        ) : (
                                            <ArrowDownRight className="h-4 w-4" />
                                        )}
                                        {station.isOnline ? "En ligne" : "Hors ligne"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6">
                        <WaitingState
                            title="En attente des stations"
                            description={"Aucune donnée réelle n'est disponible pour le moment depuis l'API AzuraCast."}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
