"use client";

import { TrendingUp, Headphones, ArrowUpRight, ArrowDownRight } from "lucide-react";
// patch: use lucide-react icons for charts UI
import { ListenerChart } from "@/components/charts/ListenerChart";

// Données simulées pour le graphique
const hourlyData = [
    { time: "00h", listeners: 120, unique: 98 },
    { time: "02h", listeners: 85, unique: 72 },
    { time: "04h", listeners: 45, unique: 38 },
    { time: "06h", listeners: 180, unique: 156 },
    { time: "08h", listeners: 420, unique: 380 },
    { time: "10h", listeners: 580, unique: 520 },
    { time: "12h", listeners: 650, unique: 590 },
    { time: "14h", listeners: 720, unique: 640 },
    { time: "16h", listeners: 890, unique: 780 },
    { time: "18h", listeners: 950, unique: 840 },
    { time: "20h", listeners: 820, unique: 710 },
    { time: "22h", listeners: 540, unique: 480 },
];

const topStations = [
    { name: "Radio Nova", listeners: 2450, change: 12.5, trend: "up" },
    { name: "FIP", listeners: 1890, change: 8.3, trend: "up" },
    { name: "France Inter", listeners: 1650, change: -3.2, trend: "down" },
    { name: "NRJ", listeners: 1420, change: 5.7, trend: "up" },
    { name: "Skyrock", listeners: 1180, change: -1.8, trend: "down" },
];

export default function ChartsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Top Charts & Statistiques</h1>
                <p className="mt-2 text-muted-foreground">
                    Analyse de l'audience et tendances d'écoute
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Auditeurs totaux aujourd'hui", value: "12,450", change: "+8.2%", positive: true },
                    { label: "Pic d'audience", value: "2,890", change: "18h00", positive: true, isTime: true },
                    { label: "Temps moyen d'écoute", value: "45 min", change: "+12%", positive: true },
                    { label: "Stations actives", value: "24/28", change: "85%", positive: true, isPercentage: true },
                ].map((stat, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card p-5">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <div className="mt-2 flex items-end gap-2">
                            <span className="text-2xl font-bold">{stat.value}</span>
                            {!stat.isTime && !stat.isPercentage && (
                                <span className={`text-sm font-medium mb-1 ${stat.positive ? "text-green-500" : "text-red-500"}`}>
                  {stat.change}
                </span>
                            )}
                            {(stat.isTime || stat.isPercentage) && (
                                <span className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.change}
                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold">Audience sur 24h</h2>
                        <p className="text-sm text-muted-foreground">Évolution des auditeurs connectés</p>
                    </div>
                    <div className="flex gap-2">
                        {["24h", "7j", "30j"].map((period) => (
                            <button
                                key={period}
                                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                    period === "24h"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
                <ListenerChart data={hourlyData} height={350} />
            </div>

            {/* Top Stations Table */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold">Classement des Stations</h2>
                    <p className="text-sm text-muted-foreground mt-1">Par nombre d'auditeurs en temps réel</p>
                </div>
                <div className="divide-y divide-border">
                                {topStations.map((station, index) => (
                        <div key={station.name} className="flex items-center gap-4 px-6 py-4 hover:bg-accent/50 transition-colors">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                  index === 0 ? "bg-yellow-500/10 text-yellow-600" :
                      index === 1 ? "bg-gray-400/10 text-gray-600" :
                          index === 2 ? "bg-orange-700/10 text-orange-700" :
                              "bg-secondary text-muted-foreground"
              }`}>
                {index + 1}
              </span>

                            <div className="flex-1">
                                <h3 className="font-medium">{station.name}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                <span role="img" aria-label="headphones" style={{ fontSize: 12 }}>🎧</span>
                                    <span className="text-sm text-muted-foreground">{station.listeners.toLocaleString()} auditeurs</span>
                                </div>
                            </div>

                            <div className={`flex items-center gap-1 text-sm font-medium ${
                                station.trend === "up" ? "text-green-500" : "text-red-500"
                            }`}>
                                {station.trend === "up" ? (
                                    <span role="img" aria-label="up" style={{ fontSize: 12 }}>⬆️</span>
                                ) : (
                                    <span role="img" aria-label="down" style={{ fontSize: 12 }}>⬇️</span>
                                )}
                                {Math.abs(station.change)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
