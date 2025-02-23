export interface PlaylistEntryBuild {
  extinf: string; // The EXTINF line
  path: string; // The media path/URL line
}

export interface ParsedPlaylistEntry {
  duration: number;
  title: string;
  path: string;
  tvgId?: string;
  tvgName?: string;
  tvgLogo?: string;
  groupTitle?: string;
  rawExtinf?: string;
  rawPath?: string;
  seriesTitle?: string;
  seriesSeason?: number;
  seriesEpisode?: number;
}

export interface PlaylistEntry extends ParsedPlaylistEntry {
  playlist: string;
  id?: string;
}

export function parsePlaylistEntry(
  entry: PlaylistEntryBuild
): ParsedPlaylistEntry {
  const parsed: ParsedPlaylistEntry = {
    duration: -1,
    title: "",
    path: entry.path.trim(),
  };

  // Parse the EXTINF line
  let extinfLine = entry.extinf.trim();

  // Extract duration
  const durationMatch = extinfLine.match(/#EXTINF:([-\d.]+)/);
  if (durationMatch) {
    parsed.duration = parseFloat(durationMatch[1]);
  }

  // Extract TVG attributes
  const tvgIdMatch = extinfLine.match(/tvg-id="([^"]*)"/);
  const tvgNameMatch = extinfLine.match(/tvg-name="([^"]*)"/);
  const tvgLogoMatch = extinfLine.match(/tvg-logo="([^"]*)"/);
  const groupTitleMatch = extinfLine.match(/group-title="([^"]*)"/);

  if (tvgIdMatch) {
    parsed.tvgId = tvgIdMatch[1];
    extinfLine = extinfLine.replace(tvgIdMatch[0], "");
  }
  if (tvgNameMatch) {
    parsed.tvgName = tvgNameMatch[1];
    extinfLine = extinfLine.replace(tvgNameMatch[0], "");
  }
  if (tvgLogoMatch) {
    parsed.tvgLogo = tvgLogoMatch[1];
    extinfLine = extinfLine.replace(tvgLogoMatch[0], "");
  }
  if (groupTitleMatch) {
    parsed.groupTitle = groupTitleMatch[1];
    extinfLine = extinfLine.replace(groupTitleMatch[0], "");
  }

  // Extract title
  const titleMatch = extinfLine.match(
    /,(.+)$/
  );
  if (titleMatch && titleMatch[1]) {
    parsed.title = titleMatch[1].trim();
  }

  parsed.rawExtinf = entry.extinf;
  parsed.rawPath = entry.path;

  // Validation
  if (parsed.tvgLogo) {
    try {
      const url = new URL(parsed.tvgLogo);
      if (!["http:", "https:", "data:"].includes(url.protocol)) {
        throw new Error(`Invalid TVG logo protocol: ${url.protocol}`);
      }
    } catch (_) {
      const errorMessage = `Invalid TVG logo URL: ${parsed.tvgLogo}`;
      console.debug(errorMessage.substring(0, 64) + "...");
      parsed.tvgLogo = "/file.svg";
    }
  }
  if (parsed.path) {
    if (
      !parsed.path.match(
        /^(?:https?:\/\/)(?:[\w-]+\.)+[\w-]+(?::\d+)?(?:\/[\w-\.\/]+)*(?:\.\w+)?$/
      )
    ) {
      console.debug(`Invalid path: ${parsed.path}`);
      parsed.path = "https://example.org/";
    }
  }
  if (parsed.rawExtinf && parsed.rawExtinf.length > 5000) {
    // console.debug(`Raw EXTINF is too long: ${parsed.rawExtinf}`);
    parsed.rawExtinf = parsed.rawExtinf.substring(0, 5000);
  }
  if (parsed.title && parsed.title.length > 5000) {
    console.debug(`Title is too long: ${parsed.title}`);
    parsed.title = parsed.title.substring(0, 5000);
  }

  return parsed;
}

export function parseSeriesEpisode(entryTitle: string) {
    const seasonNumber = entryTitle?.match(/S(\d+)/)?.[1];
    const episodeNumber = entryTitle?.match(/E(\d+)/)?.[1];
    const title = entryTitle.replace("SRS -", "").replace(`S${seasonNumber}`, "").replace(`E${episodeNumber}`, "").trim();
    if (!seasonNumber || !episodeNumber || !title) {
        return;
    }
    return { seasonNumber, episodeNumber, title };
}
