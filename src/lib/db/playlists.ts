"use server";

import { pb } from "@/lib/pocketbase";

export async function getPlaylists() {
    const playlists = await pb.collection("playlists").getList(1, 50);
    return playlists;
}

export async function getPlaylist(id: string) {
    const playlist = await pb.collection("playlists").getOne(id);
    return playlist;
}
export async function getUserPlaylist(userId: string) {
    const playlist = await pb.collection("playlists").getFirstListItem(`createdBy = "${userId}"`);
    return playlist;
}
