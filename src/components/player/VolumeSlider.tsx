"use client";

import { Volume2, Volume1, VolumeX } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VolumeSliderProps {
    volume: number;
    onChange: (volume: number) => void;
    className?: string;
}

export function VolumeSlider({ volume, onChange, className }: VolumeSliderProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [previousVolume, setPreviousVolume] = useState(0.8);

    const handleMute = () => {
        if (volume > 0) {
            setPreviousVolume(volume);
            onChange(0);
        } else {
            onChange(previousVolume || 0.8);
        }
    };

    // Icon fallback: use lucide icons for volume state
    const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

    return (
        <div
            className={cn("flex items-center gap-2 group", className)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <button
                onClick={handleMute}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
                <VolumeIcon className="h-4 w-4" />
            </button>

            <div className="relative flex items-center w-24">
                <div className="absolute inset-y-0 left-0 right-0 h-1 rounded-full bg-secondary overflow-hidden">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-150"
                        style={{ width: `${volume * 100}%` }}
                    />
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="relative w-full h-4 opacity-0 cursor-pointer"
                />

                {/* Custom thumb visible on hover */}
                <div
                    className={cn(
                        "absolute h-3 w-3 rounded-full bg-primary shadow-md transition-all duration-200 pointer-events-none",
                        isHovering ? "scale-100" : "scale-0"
                    )}
                    style={{ left: `calc(${volume * 100}% - 6px)` }}
                />
            </div>

            <span className="text-xs font-medium text-muted-foreground w-8 text-right">
        {Math.round(volume * 100)}%
      </span>
        </div>
    );
}
