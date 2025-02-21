import H1 from "@/components/ui/h1";
import { getSeriesGroups } from "./actions";
import { TvCategory } from "../../components/TvCategory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserPlaylist } from "@/lib/db/playlists";

export default async function SeriesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    redirect("/login");
  }
  const playlist = await getUserPlaylist(session?.user.id as string);
  const seriesGroups = await getSeriesGroups(playlist.id as string);

  return (
    <div className="flex flex-col gap-4">
      <H1>Series</H1>

      <div className="flex flex-wrap gap-4">
        {seriesGroups.items.map((group) => (
          <TvCategory key={group.id} name={group.group} id={group.id} />
        ))}
      </div>
      <pre>{JSON.stringify(seriesGroups, null, 2)}</pre>
    </div>
  );
}
