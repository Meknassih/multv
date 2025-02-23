import H1 from "@/components/ui/h1";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions, AuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserPlaylist } from "@/lib/db/playlists";
import { SeriesClient } from "./client";

export default async function SeriesPage() {
  const session = await getServerSession<AuthOptions, AuthSession>(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }
  const playlist = await getUserPlaylist(session?.user.id as string);

  return (
    <div className="flex flex-col gap-4">
      <H1>Series</H1>
      <SeriesClient playlistId={playlist.id as string} />
    </div>
  );
}
