export interface PlaylistEntryBuild {
    extinf: string;  // The EXTINF line
    path: string;    // The media path/URL line
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
}

export interface PlaylistEntry extends ParsedPlaylistEntry {
    playlist: string;
    id?: string;
}

export function parsePlaylistEntry(entry: PlaylistEntryBuild): ParsedPlaylistEntry {
    const parsed: ParsedPlaylistEntry = {
        duration: -1,
        title: '',
        path: entry.path.trim()
    };

    // Parse the EXTINF line
    const extinfLine = entry.extinf.trim();
    
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

    if (tvgIdMatch) parsed.tvgId = tvgIdMatch[1];
    if (tvgNameMatch) parsed.tvgName = tvgNameMatch[1];
    if (tvgLogoMatch) parsed.tvgLogo = tvgLogoMatch[1];
    if (groupTitleMatch) parsed.groupTitle = groupTitleMatch[1];

    // Extract title (everything after the last comma)
    const titleMatch = extinfLine.match(/,[^,]*$/);
    if (titleMatch) {
        parsed.title = titleMatch[0].substring(1).trim();
    }

    parsed.rawExtinf = entry.extinf;
    parsed.rawPath = entry.path;

    return parsed;
}
