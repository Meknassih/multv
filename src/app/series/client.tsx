"use client";

import { useEffect, useState } from "react";
import InputWithLabelAndButton from "@/components/InputWithLabelAndButton";
import { TvCategory } from "@/components/TvCategory";
import { Series } from "@/types/series";
import { getSeries, searchSeries } from "./actions";
import LoadingTvItems from "@/components/LoadingTvItems";

export function SeriesClient({ playlistId }: { playlistId: string }) {
  const [search, setSearch] = useState("");
  const [series, setSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getSeries(playlistId).then((series) => {
      setSeries(series.items);
      setIsLoading(false);
    });
  }, [playlistId]);

  const handleSearch = () => {
    setIsLoading(true);
    if (search) {
      searchSeries(playlistId, search).then((series) => {
        setSeries(series.items);
        setIsLoading(false);
      });
    } else {
      getSeries(playlistId).then((series) => {
        setSeries(series.items);
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
          series.length > 0 ?
            series.map((serie) => (
              <TvCategory key={serie.id} name={serie.title} id={serie.id} />
            ))
            : <div>No series categories found</div>
        )}
      </div>
    </div>
  );
}
