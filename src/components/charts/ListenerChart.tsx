"use client";

import { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface ListenerData {
    time: string;
    listeners: number;
    unique: number;
}

interface ListenerChartProps {
    data: ListenerData[];
    className?: string;
    height?: number;
}

export function ListenerChart({ data, className, height = 300 }: ListenerChartProps) {
    const maxListeners = useMemo(() =>
            Math.max(...data.map(d => d.listeners)) * 1.2,
        [data]
    );

    return (
        <div className={cn("w-full", className)}>
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="listenersGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="uniqueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--green-500))" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="hsl(var(--green-500))" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />

                    <XAxis
                        dataKey="time"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />

                    <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, maxListeners]}
                    />

                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (!active || !payload) return null;
                            return (
                                <div className="rounded-xl border border-border bg-card p-3 shadow-xl">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
                                    {payload.map((entry: any) => (
                                        <div key={entry.name} className="flex items-center gap-2 text-sm">
                                            <div
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: entry.color }}
                                            />
                                            <span className="font-medium">{entry.name}:</span>
                                            <span className="font-bold">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="listeners"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#listenersGradient)"
                        name="Auditeurs"
                    />

                    <Area
                        type="monotone"
                        dataKey="unique"
                        stroke="hsl(142, 76%, 36%)"
                        strokeWidth={2}
                        fill="url(#uniqueGradient)"
                        name="Uniques"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
