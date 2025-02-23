"use client";

import { useEffect, useState } from "react";
import InputWithLabelAndButton from "@/components/InputWithLabelAndButton";
import { TvCategory } from "@/components/TvCategory";
import { GroupTitlesSrs } from "@/types/groupTitlesSrs";
import { getSeriesGroups, searchSeriesGroups } from "./actions";
import LoadingTvItems from "@/components/LoadingTvItems";

export function SeriesClient({ playlistId }: { playlistId: string }) {
  const [search, setSearch] = useState("");
  const [seriesGroups, setSeriesGroups] = useState<GroupTitlesSrs[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getSeriesGroups(playlistId).then((seriesGroups) => {
      setSeriesGroups(seriesGroups.items);
      setIsLoading(false);
    });
  }, [playlistId]);

  const handleSearch = () => {
    setIsLoading(true);
    if (search) {
      searchSeriesGroups(playlistId, search).then((seriesGroups) => {
        setSeriesGroups(seriesGroups.items);
        setIsLoading(false);
      });
    } else {
      getSeriesGroups(playlistId).then((seriesGroups) => {
        setSeriesGroups(seriesGroups.items);
        setIsLoading(false);
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <InputWithLabelAndButton
        placeholder="Series Name"
        buttonText="Search"
        id="search"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClick={handleSearch}
      />
      <div className="flex flex-wrap gap-4">
        {isLoading ? (
          <LoadingTvItems />
        ) : (
          seriesGroups.length > 0 ?
            seriesGroups.map((group) => (
              <TvCategory key={group.id} name={group.group} id={group.id} />
            ))
            : <div>No series categories found</div>
        )}
      </div>
    </div>
  );
}
