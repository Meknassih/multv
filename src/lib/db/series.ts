"use server";

import { pb } from "@/lib/pocketbase";
import { GroupTitlesSrs } from "@/types/groupTitlesSrs";


export async function getPlaylistSeriesGroups(playlistId: string, page = 1, itemsPerPage = 50, filter: string = "") {
    const seriesGroups = await pb.collection("groupTitlesSrs").getList<GroupTitlesSrs>(page, itemsPerPage, {
        filter: `playlist = "${playlistId}"${filter ? ` && ${filter}` : ""}`
    });
    return seriesGroups;
}