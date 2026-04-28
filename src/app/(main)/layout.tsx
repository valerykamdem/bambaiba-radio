"use client";

// import { useState, createContext, useContext } from "react";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import GlobalPlayer from "@/components/player/GlobalPlayer"
import { PlayerProvider } from "@/contexts/PlayerContext";

interface PlayerContextType {
    currentStation: {
        shortcode: string;
        name: string;
        listenUrl: string;
        art?: string;
        song?: {
            title: string;
            artist: string;
            art: string;
        };
    } | null;
    setCurrentStation: (station: PlayerContextType["currentStation"]) => void;
}

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <PlayerProvider>
            <div className="flex min-h-screen flex-col bg-background">
                {/* Top Navigation */}
                <Suspense fallback={<div className="h-16 w-full bg-muted animate-pulse" />}>
                    <Navbar />
                </Suspense>

                {/* Main Content */}
                <div className="flex flex-1">

                    <Suspense fallback={<div className="h-16 w-full bg-muted animate-pulse" />}>
                        <Sidebar />
                    </Suspense>

                    <main className="flex-1 min-w-0 px-4 py-6 lg:px-8 lg:py-8">
                        <div className="mx-auto max-w-6xl">{children}</div>
                    </main>
                </div>

                {/* Global Player */}
                <GlobalPlayer />

                {/* Spacer when player is visible */}
                <div className="h-20" />
            </div>
        </PlayerProvider>
    );
}
