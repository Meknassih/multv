"use server";

import { pb } from "@/lib/pocketbase";
import { Playlist } from "@/types/playlist";

export async function getPlaylists() {
    const playlists = await pb.collection("playlists").getList<Playlist>(1, 50);
    return playlists;
}

export async function getPlaylist(id: string) {
    const playlist = await pb.collection("playlists").getOne<Playlist>(id);
    return playlist;
}
export async function getUserPlaylist(userId: string) {
    const playlist = await pb.collection("playlists").getFirstListItem<Playlist>(`createdBy = "${userId}"`);
    return playlist;
}
