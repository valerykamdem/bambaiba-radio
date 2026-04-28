"use client";

import { useState } from "react";
// lucide-react icons replaced with emoji fallbacks for compatibility
import { useAllStations } from "@/lib/hooks/useNowPlaying";
import {ChevronRight, Clock, Radio} from "lucide-react";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

export default function ProgramsPage() {
    const { stations } = useAllStations();
    const [selectedDay, setSelectedDay] = useState(0);
    const [selectedStation, setSelectedStation] = useState<string | null>(null);

    // Données simulées de programme - à remplacer par API AzuraCast schedule
    const schedule = [
        { time: "06:00", title: "Le Réveil", host: "Marie L.", type: "info" },
        { time: "09:00", title: "Morning Show", host: "Team Matinale", type: "talk" },
        { time: "12:00", title: "Journal de Midi", host: "Équipe Info", type: "info" },
        { time: "14:00", title: "After Work", host: "DJ Mike", type: "music" },
        { time: "18:00", title: "Drive Time", host: "Sarah & Tom", type: "talk" },
        { time: "21:00", title: "Late Night", host: "DJ Shadow", type: "music" },
        { time: "00:00", title: "Nuit Blanche", host: "Auto", type: "music" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Grille des Programmes</h1>
                <p className="mt-2 text-muted-foreground">
                    Découvrez les émissions de la semaine sur toutes nos stations
                </p>
            </div>

            {/* Station Selector */}
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

            {/* Day Selector */}
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

            {/* Schedule Grid */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-[80px_1fr] divide-y divide-border">
                    {schedule.map((item, index) => (
                        <div key={index} className="contents">
                            {/* Time Column */}
                            <div className="flex items-center justify-center border-r border-border bg-secondary/30 px-4 py-4">
                                <div className="text-center">
                                    <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                                    <span className="text-sm font-semibold">{item.time}</span>
                                </div>
                            </div>

                            {/* Program Column */}
                            <div className="flex items-center gap-4 px-4 py-4 hover:bg-accent/50 transition-colors group cursor-pointer">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                                    item.type === "music" ? "bg-purple-500/10 text-purple-500" :
                                        item.type === "talk" ? "bg-blue-500/10 text-blue-500" :
                                            "bg-orange-500/10 text-orange-500"
                                }`}>
                                {item.type === "music" ? <span role="img" aria-label="music" style={{fontSize:14}}>🎵</span> :
                                    item.type === "talk" ? <span role="img" aria-label="talk" style={{fontSize:14}}>🎙️</span> :
                                        <span role="img" aria-label="time" style={{fontSize:14}}>🕒</span>}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Présenté par {item.host}
                                    </p>
                                </div>

                                <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Live Now Indicator */}
            <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-accent to-background border border-primary/20 p-6">
                <div className="flex items-center gap-3 mb-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
                    <span className="text-sm font-semibold text-primary">EN CE MOMENT</span>
                </div>
                <h2 className="text-xl font-bold">Morning Show — Épisode 245</h2>
                <p className="text-muted-foreground mt-1">
                    L&apos;actualité musicale et les tendances du moment avec la Team Matinale
                </p>
                <div className="mt-4 flex gap-2">
                    <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                        Écouter en direct
                    </button>
                    <button className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
                        Plus d&apos;infos
                    </button>
                </div>
            </div>
        </div>
    );
}
