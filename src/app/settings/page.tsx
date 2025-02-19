"use client";
export const dynamic = "force-dynamic",
  fetchCache = "default-no-store";

import H1 from "@/components/ui/h1";
import { useEffect, useState } from "react";
import InputWithLabelAndButton from "@/components/InputWithLabelAndButton";
import H2 from "@/components/ui/h2";
import { getUserPlaylist, savePlaylistUrl } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { getLocalUser, User } from "@/types/user";

export default function SettingsPage() {
  const [user, setUser] = useState(() => getLocalUser());
  const [playlistUrl, setPlaylistUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const user = window.localStorage.getItem("user");
    if (!user) {
      throw new Error("User not found");
    }
    setUser(JSON.parse(user) as User);
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchPlaylist = async () => {
      try {
        const playlistRecord = await getUserPlaylist(user.id);
        setPlaylistUrl(playlistRecord.url);
      } catch (error) {
        console.debug("Error fetching playlist", error);
        setPlaylistUrl("");
      }
    };
    fetchPlaylist();
  }, [user]);

  const onSavePlaylistUrl = async () => {
    if (!user) {
      return;
    }
    try {
      await savePlaylistUrl(user.id, playlistUrl);
      toast({
        title: "Playlist URL saved",
        description:
          "Your playlist URL has been saved, wait for the syncing to finish",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <>
      <H1>Settings</H1>
      <div>
        <H2>General</H2>
        <div>
          <InputWithLabelAndButton
            id="playlistUrl"
            type="text"
            label="Playlist URL"
            placeholder="http://localhost:8090"
            buttonText="Save"
            onClick={onSavePlaylistUrl}
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
