"use client";

import { useEffect } from "react";
import { Radio } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error("Erreur dans la page :", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-300">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
                <Radio className="h-10 w-10 text-destructive" />
            </div>

            <h2 className="text-2xl font-bold">Une erreur est survenue</h2>

            <p className="text-muted-foreground mt-3 max-w-md">
                Impossible de charger les données depuis AzuraCast.
                Vérifiez que le serveur est démarré ou réessayez.
            </p>

            <button
                onClick={() => reset()}
                className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
                Réessayer
            </button>
        </div>
    );
}
