"use client";

import { Users, Headphones } from "lucide-react";

interface ListenerCountProps {
    total: number;
    unique: number;
}

export function ListenerCount({ total, unique }: ListenerCountProps) {
    return (
        <div className="flex gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                    <p className="text-lg font-bold leading-none">{total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2">
                <Headphones className="h-4 w-4 text-green-500" />
                <div>
                    <p className="text-lg font-bold leading-none">{unique}</p>
                    <p className="text-xs text-muted-foreground">Uniques</p>
                </div>
            </div>
        </div>
    );
}
