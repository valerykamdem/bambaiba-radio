"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { useAllStations } from "@/lib/hooks/useNowPlaying";
import { AzuraCast } from "@/lib/azuracast";
import { StationSchedule } from "@/types/azuracast";
import { CalendarClock, Clock, Hourglass, Mic2, Radio } from "lucide-react";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

type ProgramEntry = StationSchedule & {
    stationName: string;
    stationShortcode: string;
};

function getCurrentDayIndex() {
    return (new Date().getDay() + 6) % 7;
}

function getScheduleDayIndex(timestamp: number) {
    return (new Date(timestamp * 1000).getDay() + 6) % 7;
}

function formatTime(timestamp: number) {
    return new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(timestamp * 1000));
}

function useProgramSchedules(
    stations: ReturnType<typeof useAllStations>["stations"],
    selectedStation: string | null
) {
    const stationKeys = useMemo(
        () => stations.map((station) => station.station.shortcode).sort(),
        [stations]
    );

    const { data, error, isLoading } = useSWR<ProgramEntry[]>(
        stationKeys.length ? ["program-schedules", selectedStation ?? "all", stationKeys.join("|")] : null,
        async () => {
            const selectedStations = selectedStation
                ? stations.filter((station) => station.station.shortcode === selectedStation)
                : stations;

            const schedules = await Promise.allSettled(
                selectedStations.map(async (station) => {
                    const stationSchedule = await AzuraCast.getStationSchedule(station.station.shortcode);

                    return stationSchedule.map((program) => ({
                        ...program,
                        stationName: station.station.name,
                        stationShortcode: station.station.shortcode,
                    }));
                })
            );

            return schedules.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
        },
        {
            refreshInterval: 60000,
            revalidateOnFocus: true,
            dedupingInterval: 30000,
        }
    );

    return {
        schedules: data ?? [],
        isLoading,
        isError: error,
    };
}

export default function ProgramsPage() {
    const { stations, isLoading: isLoadingStations } = useAllStations();
    const [selectedDay, setSelectedDay] = useState(getCurrentDayIndex);
    const [selectedStation, setSelectedStation] = useState<string | null>(null);
    const { schedules, isLoading: isLoadingSchedules } = useProgramSchedules(stations, selectedStation);

    const daySchedules = useMemo(
        () =>
            schedules
                .filter((item) => getScheduleDayIndex(item.start_timestamp) === selectedDay)
                .sort((a, b) => a.start_timestamp - b.start_timestamp),
        [schedules, selectedDay]
    );

    const isLoading = isLoadingStations || isLoadingSchedules;
    const hasPrograms = daySchedules.length > 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Grille des Programmes</h1>
                <p className="mt-2 text-muted-foreground">
                    Les émissions publiées depuis l&apos;API de la radio
                </p>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                    onClick={() => setSelectedStation(null)}
                    className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                        !selectedStation
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Toutes les stations
                </button>
                {stations.map((s) => (
                    <button
                        key={s.station.shortcode}
                        onClick={() => setSelectedStation(s.station.shortcode)}
                        className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                            selectedStation === s.station.shortcode
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Radio className="h-3.5 w-3.5" />
                        {s.station.name}
                    </button>
                ))}
            </div>

            <div className="flex gap-1 rounded-xl bg-secondary p-1">
                {DAYS.map((day, index) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(index)}
                        className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                            selectedDay === index
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {day.slice(0, 3)}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <PendingPrograms
                    title="Chargement de la grille"
                    description="Nous récupérons les programmes depuis l'API."
                />
            ) : hasPrograms ? (
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="grid grid-cols-[96px_1fr] divide-y divide-border">
                        {daySchedules.map((item) => (
                            <div key={`${item.stationShortcode}-${item.id}-${item.start_timestamp}`} className="contents">
                                <div className="flex items-center justify-center border-r border-border bg-secondary/30 px-4 py-4">
                                    <div className="text-center">
                                        <Clock className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-semibold">
                                            {formatTime(item.start_timestamp)}
                                        </span>
                                        <span className="mt-0.5 block text-xs text-muted-foreground">
                                            {formatTime(item.end_timestamp)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent/50">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        {item.is_dj ? <Mic2 className="h-5 w-5" /> : <CalendarClock className="h-5 w-5" />}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate font-semibold text-foreground">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.stationName}
                                            {item.description ? ` • ${item.description}` : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <PendingPrograms
                    title="Programmes en attente"
                    description="Aucun programme n'est disponible via l'API pour cette sélection."
                />
            )}
        </div>
    );
}

function PendingPrograms({ title, description }: { title: string; description: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <Hourglass className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
