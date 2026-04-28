"use client";

import { cn } from "@/lib/utils";
import { Play, Pause, SkipBack, SkipForward, Loader2 } from "lucide-react";

interface PlayerControlsProps {
    isPlaying: boolean;
    isLoading: boolean;
    onTogglePlay: () => void;
    onPrevious?: () => void;
    onNext?: () => void;
    canPrevious?: boolean;
    canNext?: boolean;
}

export function PlayerControls({
                                   isPlaying,
                                   isLoading,
                                   onTogglePlay,
                                   onPrevious,
                                   onNext,
                                   canPrevious = false,
                                   canNext = false,
                               }: PlayerControlsProps) {
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onPrevious}
                disabled={!canPrevious}
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors",
                    canPrevious ? "hover:text-foreground hover:bg-accent" : "opacity-30 cursor-not-allowed"
                )}
            >
                <SkipBack className="h-4 w-4 fill-current" />
            </button>

            <button
                onClick={onTogglePlay}
                disabled={isLoading}
                className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200",
                    "hover:scale-105 active:scale-95",
                    isLoading && "opacity-70"
                )}
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
            </button>

            <button
                onClick={onNext}
                disabled={!canNext}
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors",
                    canNext ? "hover:text-foreground hover:bg-accent" : "opacity-30 cursor-not-allowed"
                )}
            >
                <SkipForward className="h-4 w-4 fill-current" />
            </button>
        </div>
    );
}
