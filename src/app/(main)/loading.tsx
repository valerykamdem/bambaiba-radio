export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-300">
            <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-6" />

            <h2 className="text-xl font-semibold">Chargement des stations…</h2>
            <p className="text-muted-foreground mt-2">
                Récupération des données en temps réel depuis AzuraCast
            </p>
        </div>
    );
}
