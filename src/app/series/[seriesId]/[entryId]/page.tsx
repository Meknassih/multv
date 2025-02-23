"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PlaylistEntry } from "@/types/playlistEntry";
import { getPlaylistEntry } from "@/lib/db/playlistEntry";
import H1 from "@/components/ui/h1";
import Image from "next/image";

export default function SeriesEntryPage() {
  const { entryId } = useParams();
  const [entry, setEntry] = useState<PlaylistEntry | null>(null);

  useEffect(() => {
    if (!entryId) return;
    getPlaylistEntry(entryId as string).then((entry) => {
      setEntry(entry);
    });
  }, [entryId]);

  if (!entry) return <div>Loading...</div>;

  return (
    <div>
      {entry ? (
        <>
          <H1>{entry.title}</H1>
          <div>
            {entry.tvgLogo && (
              <Image
                src={entry.tvgLogo}
                alt={entry.title ?? ""}
                width={350}
                height={140}
              />
            )}
          </div>
          {entry.path ? (
            <video width="800" height="600" controls>
              <source src={entry.path} />
            </video>
          ) : (
            <div>No path found for the video stream</div>
          )}

          <pre>{JSON.stringify(entry, null, 2)}</pre>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
