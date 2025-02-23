"use server";

import { pb } from "@/lib/pocketbase";
import { Playlist } from "@/types/playlist";
import { RecordModel } from "pocketbase";
import axios from "axios";
import { createInterface } from "readline";
import { Readable } from "stream";
import {
  parsePlaylistEntry,
  parseSeriesEpisode,
  PlaylistEntry,
  PlaylistEntryBuild,
} from "@/types/playlistEntry";

export async function getPlaylists() {
  const playlists = await pb.collection("playlists").getList<Playlist>(1, 50);
  return playlists;
}

export async function getPlaylist(id: string) {
  const playlist = await pb.collection("playlists").getOne<Playlist>(id);
  return playlist;
}
export async function getUserPlaylist(userId: string) {
  const playlist = await pb
    .collection("playlists")
    .getFirstListItem<Playlist>(`createdBy = "${userId}"`);
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
    // Set playlist isSyncing to true
    await pb.collection("playlists").update(id, { isSyncing: true });

    // Wipe out all existing entries
    await deletePlaylistEntries(id);

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

    let currentEntry: PlaylistEntryBuild | null = null;

    let count = 0;
    let batch = pb.createBatch();
    const batchSize = 1000;

    for await (const line of rl) {
      if (line.startsWith("#EXTINF:")) {
        // Start of a new entry
        if (currentEntry) {
          if (count > 0 && count % batchSize === 0) {
            await batch.send();
            logBatchSent("CREATE", count, batchSize);
            batch = pb.createBatch();
          }
          let parsedEntry: Omit<PlaylistEntry, "playlist">;
          try {
          } catch (error) {
            console.error(error);
          }
          try {
            parsedEntry = parsePlaylistEntry(currentEntry);
            const seriesData = parseSeriesEpisode(parsedEntry.title);
            batch.collection("playlistEntries").create({
              ...parsedEntry,
              playlist: id,
              seriesTitle: seriesData?.title,
              seriesSeason: seriesData?.seasonNumber,
              seriesEpisode: seriesData?.episodeNumber,
            });
            count++;
          } catch (error) {
            console.error(error);
            continue;
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
      count++;
    }

    if (count % batchSize > 0) {
      await batch.send();
      logBatchSent("CREATE", count, batchSize);
    }

    // Set playlist isSyncing to false
    await pb
      .collection("playlists")
      .update(id, { isSyncing: false, lastSynced: new Date().toISOString() });
  } catch (error) {
    console.error("Error syncing playlist", error);
  }
};

export const deletePlaylistEntries = async (playlistId: string) => {
  const batchSize = 1000;
  const entries = await pb
    .collection("playlistEntries")
    .getFullList<PlaylistEntry>({
      filter: `playlist = "${playlistId}"`,
    });

  console.debug(`Deleting ${entries.length} playlist entries`);

  let batch = pb.createBatch();
  let count = 0;
  for (const entry of entries) {
    if (entry.id) {
      await batch.collection("playlistEntries").delete(entry.id);
      count++;
    }
    if (count > 0 && count % batchSize === 0) {
      await batch.send();
      logBatchSent("DELETE", count, batchSize);
      batch = pb.createBatch();
    }
  }
  if (count > 0 && count % batchSize > 0) {
    await batch.send();
    logBatchSent("DELETE", count, batchSize);
  }
};

export const createSeriesSeasons = async (playlistId: string) => {
  const playlist = await pb.collection("playlists").getOne<Playlist>(playlistId);
  if (!playlist) {
    throw new Error("Playlist not found");
  }
  const entries = await pb.collection("playlistEntries").getFullList<PlaylistEntry>({
    filter: `playlist = "${playlistId}" && groupTitle ~ "SRS -%"`,
  });
  for (const entry of entries) {
    const season = entry.groupTitle?.match(/S(\d+)/)?.[1];
    const episode = entry.groupTitle?.match(/E(\d+)/)?.[1];
    if (season && episode) {
      console.debug(`Entry: ${entry.title}, Season: ${season}, Episode: ${episode}`);
      const title = entry.title.replace("SRS -", "").replace(`S${season}`, "").replace(`E${episode}`, "").trim();
      await pb.collection("seriesSeasons").create({
        title,
        playlist: playlist.id,
        season,
        episode,
      });
    }
  }
};

const logBatchSent = (type: string, count: number, batchSize: number) => {
  console.debug(
    `Sending ${type} batch ${Math.ceil(
      count / batchSize
    )} of ${batchSize} entries`
  );
};
