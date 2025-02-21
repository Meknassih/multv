import H1 from "@/components/ui/h1";
import { getSeriesGroups } from "./actions";
import { TvCategory } from "../../components/TvCategory"

export default async function SeriesPage() {
    const seriesGroups = await getSeriesGroups(playlistId);

    return (
        <div className="flex flex-col gap-4">
            <H1>Series</H1>

            <div className="flex flex-wrap gap-4">
                {seriesGroups.items.map((group) => (
                    <TvCategory key={group.id} name={group.title} id={group.id} />
                ))}
            </div>
        </div>
    )
}