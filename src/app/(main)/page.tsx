import { AzuraCast } from "@/lib/azuracast";
import HomeClient from "./HomeClient";

export default async function HomePage() {
    const stations = await AzuraCast.getAllNowPlaying();

    return <HomeClient initialStations={stations} />;
}
