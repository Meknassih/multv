"use server";

import { pb } from "@/lib/pocketbase";
import { GroupTitlesSrs } from "@/types/groupTitlesSrs";
import { Series } from "../../types/series"


export async function getPlaylistSeriesGroups(playlistId: string, page = 1, itemsPerPage = 50, filter: string = "") {
    const seriesGroups = await pb.collection("groupTitlesSrs").getList<GroupTitlesSrs>(page, itemsPerPage, {
        filter: `playlist = "${playlistId}"${filter ? ` && ${filter}` : ""}`
    });
    return seriesGroups;
}

export async function getSeriesGroup(srsGroupId: string) {
    const seriesGroup = await pb.collection("groupTitlesSrs").getOne<GroupTitlesSrs>(srsGroupId);
    return seriesGroup;
}

export async function getSeriesByPlaylist(playlistId: string, page = 1, itemsPerPage = 50, filter: string = "") {
    const series = await pb.collection("series").getList<Series>(page, itemsPerPage, {
        filter: `playlist = "${playlistId}"${filter ? ` && ${filter}` : ""}`
    });
    return series;
}

export async function getSeries(seriesId: string) {
    const series = await pb.collection("series").getOne<Series>(seriesId);
    return series;
}
