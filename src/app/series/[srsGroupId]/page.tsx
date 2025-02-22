"use client";

import { useParams } from "next/navigation";
import { getSeriesGroup } from "@/lib/db/series";
import { useEffect, useState } from "react"
import { GroupTitlesSrs } from "../../../types/groupTitlesSrs"
import H1 from "@/components/ui/h1"
import { TvItem } from "../../../components/TvItem"
import { getPlaylistEntriesByGroupTitle } from "@/lib/db/playlistEntry";
import { PlaylistEntry } from "../../../types/playlistEntry"

export default function SeriesGroupPage() {
  const { srsGroupId } = useParams();
  const [seriesGroup, setSeriesGroup] = useState<GroupTitlesSrs | null>(null);
  const [series, setSeries] = useState<PlaylistEntry[]>([]);

  useEffect(() => {
    getSeriesGroup(srsGroupId as string).then((seriesGroup) => {
      setSeriesGroup(seriesGroup);
    });
  }, [srsGroupId]);

  useEffect(() => {
    if (!seriesGroup) return;
    getPlaylistEntriesByGroupTitle(seriesGroup.playlist as string, seriesGroup.groupTitle as string).then((series) => {
      setSeries(series.items);
    });
  }, [seriesGroup]);

  return (
    <div>
      {seriesGroup && (
        <>
          <H1>{seriesGroup.groupTitle}</H1>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-4">
              {series.map((series) => (
                <TvItem key={series.id} name={series.title} id={series.id!} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

