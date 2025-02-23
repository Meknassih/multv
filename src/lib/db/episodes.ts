"use server";

import { pb } from "@/lib/pocketbase";
import { Episode } from "@/types/episode";

export async function getEpisodesBySeasonNumber(seriesTitle: string, seasonNumber: string, page = 1, itemsPerPage = 50, filter: string = "") {
    const episodes = await pb.collection("episodes").getList<Episode>(page, itemsPerPage, {
        filter: `seriesTitle = "${seriesTitle}" && seriesSeason = "${seasonNumber}"${filter ? ` && ${filter}` : ""}`,
        sort: "seriesEpisode"
    });
    return episodes;
}

export async function getEpisode(episodeId: string) {
    const episode = await pb.collection("episodes").getOne<Episode>(episodeId);
    return episode;
} 