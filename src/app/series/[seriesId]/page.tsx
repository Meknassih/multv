"use client";

import { useParams, usePathname } from "next/navigation";
import { getSeries} from "@/lib/db/series";
import { getSeasonsBySeriesTitle } from "@/lib/db/seasons";
import { getEpisodesBySeasonNumber } from "@/lib/db/episodes";
import { useEffect, useState } from "react";
import H1 from "@/components/ui/h1";
import { Series } from "../../../types/series";
import { Season } from "../../../types/season";
import { Episode } from "../../../types/episode";
import { ChevronDown, ChevronRight, Clipboard, PlayCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import React from "react";
import { Button } from "../../../components/ui/button"
import { toast } from "../../../hooks/use-toast"
import { useRouter } from "next/navigation";

export default function SeriesPage() {
  const params = useParams();
  const seriesId = (params as { seriesId: string }).seriesId;
  const [series, setSeries] = useState<Series | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [expandedSeasons, setExpandedSeasons] = useState<Set<string>>(new Set());
  const [episodesBySeason, setEpisodesBySeason] = useState<Record<string, Episode[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      if (typeof seriesId !== 'string') return;
      
      setIsLoading(true);
      try {
        const seriesData = await getSeries(seriesId);
        setSeries(seriesData);
        
        const seasonsData = await getSeasonsBySeriesTitle(seriesData.title);
        setSeasons(seasonsData.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [seriesId]);

  const toggleSeason = async (season: Season) => {
    const newExpandedSeasons = new Set(expandedSeasons);
    if (expandedSeasons.has(season.id)) {
      newExpandedSeasons.delete(season.id);
    } else {
      newExpandedSeasons.add(season.id);
      if (!episodesBySeason[season.id]) {
        try {
          const episodesData = await getEpisodesBySeasonNumber(series!.title, season.season.toString());
          setEpisodesBySeason(prev => ({
            ...prev,
            [season.id]: episodesData.items
          }));
        } catch (error) {
          console.error('Error fetching episodes:', error);
        }
      }
    }
    setExpandedSeasons(newExpandedSeasons);
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      {series ? (
        <>
          <H1>{series.title}</H1>
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Seasons</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Playlist ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seasons.map((season) => (
                  <React.Fragment key={`season-${season.id}`}>
                    <TableRow 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleSeason(season)}
                    >
                      <TableCell>
                        {expandedSeasons.has(season.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </TableCell>
                      <TableCell>Season {season.season}</TableCell>
                      <TableCell>{season.title}</TableCell>
                      <TableCell>{season.playlist}</TableCell>
                    </TableRow>
                    {expandedSeasons.has(season.id) && episodesBySeason[season.id]?.map((episode) => (
                      <TableRow key={`episode-${season.id}-${episode.id}`} className="bg-muted/30">
                        <TableCell></TableCell>
                        <TableCell>Episode {episode.seriesEpisode}</TableCell>
                        <TableCell colSpan={2}>{episode.seriesTitle}</TableCell>
                        <TableCell>
                          <Button className="mr-2" size="icon" onClick={() => {
                            router.push(`${pathname}/${episode.id}`)
                          }}>
                            <PlayCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => {
                            navigator.clipboard.writeText(episode.path);
                            toast({
                              title: 'Path copied to clipboard',
                              description: 'You can now paste it into your media player',
                            });
                          }}>
                            <Clipboard className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div>No series found</div>
      )}
    </div>
  );
}
