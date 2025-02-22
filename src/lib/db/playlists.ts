"use server";

import { pb } from "@/lib/pocketbase";
import { Playlist } from "@/types/playlist";
import { RecordModel } from "pocketbase";
import axios from "axios";
import { createInterface } from "readline";
import { Readable } from "stream";
import { parsePlaylistEntry, PlaylistEntry, PlaylistEntryBuild } from "@/types/playlistEntry";

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

export const savePlaylistUrl = async (userId: string, playlistUrl: string) => {
  const userRecord = await pb.collection("users").getOne(userId);
  if (!userRecord) {
    throw new Error("User not found");
  }

  let record: RecordModel;
  try {
    record = await pb
      .collection("playlists")
      .getFirstListItem(`createdBy="${userRecord.id}"`);
    record = await pb
      .collection("playlists")
      .update(record.id, { url: playlistUrl });
  } catch (error) {
    console.debug("No playlist found, creating new one", error);
    const result = await pb
      .collection("playlists")
      .create({ url: playlistUrl, createdBy: userRecord.id });
    record = result;
  }

  // Voluntarily don't await the playlist to sync
  syncPlaylist(record.id, playlistUrl);

  return record;
};

export const syncPlaylist = async (id: string, url: string) => {
  try {
    // playlist m3u file can be very large (100mb+)
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const rl = createInterface({
      input: response.data as Readable,
      crlfDelay: Infinity,
    });

    // Set playlist isSyncing to true
    await pb.collection("playlists").update(id, { isSyncing: true });

    let currentEntry: PlaylistEntryBuild | null = null;

    for await (const line of rl) {
      if (line.startsWith("#EXTINF:")) {
        // Start of a new entry
        if (currentEntry) {
          const parsedEntry = parsePlaylistEntry(currentEntry);
          try {
            console.log("Creating playlist entry: ", parsedEntry.title);
            await pb.collection("playlistEntries").create<PlaylistEntry>(
              {
                ...parsedEntry,
                playlist: id,
              },
              {
                requestKey: null,
              }
            );
          } catch (error) {
            console.error(error);
          }
        }
        currentEntry = { extinf: line, path: "" };
      } else if (line && !line.startsWith("#")) {
        // URL of the entry
        if (currentEntry) {
          currentEntry.path = line;
        }
      }
    }

    // Add the last entry if exists
    if (currentEntry) {
      const parsedEntry = parsePlaylistEntry(currentEntry);
      try {
        await pb.collection("playlistEntries").create(parsedEntry);
      } catch (error) {
        console.error(error);
      }
    }

    // Set playlist isSyncing to false
    await pb
      .collection("playlists")
      .update(id, { isSyncing: false, lastSynced: new Date().toISOString() });
  } catch (error) {
    console.error("Error syncing playlist", error);
  }
};