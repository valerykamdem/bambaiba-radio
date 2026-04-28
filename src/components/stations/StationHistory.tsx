import { AzuraCast } from "@/lib/azuracast";
import Image from "next/image";
import { Clock } from "lucide-react";

export async function StationHistory({ shortcode }: { shortcode: string }) {
    const history = await AzuraCast.getStationHistory(shortcode);

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="divide-y divide-border">
                {history.slice(0, 10).map((item, index) => (
                    <div
                        key={item.sh_id}
                        className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
                    >
            <span className="w-6 text-center text-sm font-medium text-muted-foreground">
              {index + 1}
            </span>

                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                            <Image
                                src={item.song.art || "/default-art.jpg"}
                                alt={item.song.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{item.song.title}</p>
                            <p className="truncate text-sm text-muted-foreground">
                                {item.song.artist}
                            </p>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(item.played_at * 1000).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
