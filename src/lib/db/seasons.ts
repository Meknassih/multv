"use server";

import { pb } from "@/lib/pocketbase";
import { Season } from "@/types/season";

export async function getSeasonsBySeriesTitle(seriesTitle: string, page = 1, itemsPerPage = 50, filter: string = "") {
    const seasons = await pb.collection("seasons").getList<Season>(page, itemsPerPage, {
        filter: `title = "${seriesTitle}"${filter ? ` && ${filter}` : ""}`
    });
    return seasons;
}

export async function getSeason(seasonId: string) {
    const season = await pb.collection("seasons").getOne<Season>(seasonId);
    return season;
} 