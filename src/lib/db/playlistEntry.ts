"use server";

import { PlaylistEntry } from "@/types/playlistEntry"
import { pb } from "../pocketbase"

export async function getPlaylistEntries(playlistId: string, page = 1, itemsPerPage = 50, filter: string = "") {
    const playlistEntries = await pb.collection("playlistEntries").getList<PlaylistEntry>(page, itemsPerPage, {
        filter: `playlist = "${playlistId}"${filter ? ` && ${filter}` : ""}`
    });
    return playlistEntries;
}

export async function getPlaylistEntry(playlistEntryId: string) {
    const playlistEntry = await pb.collection("playlistEntries").getOne<PlaylistEntry>(playlistEntryId);
    return playlistEntry;
}

export async function getPlaylistEntriesByGroupTitle(playlistId: string, groupTitle: string, page = 1, itemsPerPage = 50, filter: string = "") {
    const playlistEntries = await pb.collection("playlistEntries").getList<PlaylistEntry>(page, itemsPerPage, {
        filter: `playlist = "${playlistId}" && groupTitle = "${groupTitle}"${filter ? ` && ${filter}` : ""}`
    });
    return playlistEntries;
}



