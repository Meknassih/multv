"use server";

import { pb } from "@/lib/pocketbase";

export async function getPlaylistSeriesGroups(playlistId: string, page = 1, itemsPerPage = 50) {
    const seriesGroups = await pb.collection("groupTitlesSrs").getList(page, itemsPerPage, {
        filter: `playlist = "${playlistId}"`
    });
    return seriesGroups;
}