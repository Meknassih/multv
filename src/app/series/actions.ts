"use server";

import { getPlaylistSeriesGroups } from "@/lib/db/series";

export async function getSeriesGroups(playlistId: string) {
    return getPlaylistSeriesGroups(playlistId);
}	

export async function searchSeriesGroups(playlistId: string, search: string) {
    return getPlaylistSeriesGroups(playlistId, 1, 50, `groupTitle ~ "${search}"`);
}
