"use client";

import { useParams } from "next/navigation";
import { getSeriesGroup } from "@/lib/db/series";
import { useEffect, useState, useCallback } from "react";
import { GroupTitlesSrs } from "../../../types/groupTitlesSrs";
import H1 from "@/components/ui/h1";
import { TvItem } from "../../../components/TvItem";
import { getPlaylistEntriesByGroupTitle } from "@/lib/db/playlistEntry";
import { PlaylistEntry } from "../../../types/playlistEntry";
import InputWithLabelAndButton from "../../../components/InputWithLabelAndButton";
import { Skeleton } from "../../../components/ui/skeleton";
import LoadingTvItems from "../../../components/LoadingTvItems";

export default function SeriesGroupPage() {
  const { srsGroupId } = useParams();
  const [seriesGroup, setSeriesGroup] = useState<GroupTitlesSrs | null>(null);
  const [series, setSeries] = useState<PlaylistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getSeriesGroup(srsGroupId as string).then((seriesGroup) => {
      setSeriesGroup(seriesGroup);
      if (seriesGroup) {
        setIsLoading(true);
        getPlaylistEntriesByGroupTitle(
          seriesGroup.playlist as string,
          seriesGroup.groupTitle as string,
          1,
          50
        ).then((series) => {
          setSeries(series.items);
          setIsLoading(false);
        });
      }
    });
  }, [srsGroupId]);

  const handleSearch = useCallback(() => {
    if (!seriesGroup) return;
    setIsLoading(true);
    let req;
    if (search) {
      req = getPlaylistEntriesByGroupTitle(
        seriesGroup.playlist as string,
        seriesGroup.groupTitle as string,
        1,
        50,
        `title ~ "${search}"`
    )} else {
      req = getPlaylistEntriesByGroupTitle(
        seriesGroup.playlist as string,
        seriesGroup.groupTitle as string,
        1,
        50
      );
    }
    req.then((series) => {
      setSeries(series.items);
      setIsLoading(false);
    });
  }, [seriesGroup, search]);

  return (
    <>
      {seriesGroup ? (
        <div className="p-4">
          <H1>{seriesGroup.groupTitle}</H1>
        </div>
      ) : (
        <Skeleton className="w-[400px] h-[48px] rounded-md" />
      )}
      <div className="p-4">
        <InputWithLabelAndButton
          placeholder="Series Name"
          buttonText="Search"
          id="search"
          type="text"
          value={search}
        onChange={(e) => setSearch(e.target.value)}
          onClick={handleSearch}
        />
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        {isLoading ? (
          <LoadingTvItems />
        ) : (
          series.map((series) => (
            <TvItem key={series.id} name={series.title} id={series.id!} />
          ))
        )}
      </div>
    </>
  );
}
