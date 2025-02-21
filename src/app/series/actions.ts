"use server";

import { getPlaylistSeriesGroups } from "@/lib/db/series";

export async function getSeriesGroups(playlistId: string) {
    return getPlaylistSeriesGroups(playlistId);
}	