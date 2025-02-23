"use server";

import { getSeriesByPlaylist as getSeriesDb } from "@/lib/db/series";

export async function getSeries(playlistId: string, page = 1, itemsPerPage = 50) {
    return getSeriesDb(playlistId, page, itemsPerPage);
}	

export async function searchSeries(playlistId: string, search: string) {
    return getSeriesDb(playlistId, 1, 50, `title ~ "${search}"`);
}
