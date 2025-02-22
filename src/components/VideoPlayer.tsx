"use client";
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import "@vidstack/react/player/styles/base.css";
import { useState } from "react";

export function VideoPlayer(
  {
    title,
    src,
    poster,
  }: {
    title: string;
    src: string;
    poster?: string;
  }
) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative">
      <MediaPlayer
        title={title}
        src={src}
        onError={(error) => setError(error.message || "Failed to load video")}
      >
        <MediaProvider>
          {poster && (
            <Poster
            className="absolute inset-0 block h-full w-full bg-black rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
            src={poster}
              alt={title}
            />
          )}
        </MediaProvider>
      </MediaPlayer>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
          <p className="text-white p-4">{error}</p>
        </div>
      )}
    </div>
  );
}
