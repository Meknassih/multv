"use server";

import { getPlaylistSeriesGroups } from "@/lib/db/series";

export async function getSeriesGroups(playlistId: string, page = 1, itemsPerPage = 50) {
    return getPlaylistSeriesGroups(playlistId, page, itemsPerPage);
}	

export async function searchSeriesGroups(playlistId: string, search: string) {
    return getPlaylistSeriesGroups(playlistId, 1, 50, `groupTitle ~ "${search}"`);
}
