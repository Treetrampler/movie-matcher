"use client";
import { Medal, Trophy } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { MovieCard } from "@/components/catalogue/movie-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import moviesData from "@/data/movies.json"; // This should be an array of movie objects
import {
  useFetchAllUserRatings,
  useFetchMovieData,
} from "@/hooks/fetch-movie-data";
import { useGroupUsers } from "@/hooks/fetch-users-group";

const podiumData = [
  {
    place: "1st",
    order: "order-1 md:order-2",
    icon: <Trophy className="h-10 w-10 text-orange-500" />,
    height: "h-18", // equivalent to h-18 (which is 4.5rem)
    width: "w-full max-w-[280px]",
    textSize: "text-3xl",
    index: 0,
  },
  {
    place: "2nd",
    order: "order-2 md:order-1",
    icon: <Medal className="h-8 w-8 text-orange-400" />,
    height: "h-16",
    width: "w-[280px]",
    textSize: "text-2xl",
    index: 1,
  },
  {
    place: "3rd",
    order: "order-3",
    icon: <Medal className="h-8 w-8 text-orange-300" />,
    height: "h-14",
    width: "w-[280px]",
    textSize: "text-2xl",
    index: 2,
  },
];

export default function ResultsPage() {
  const params = useParams();
  const [recommendation_id, setRecommendation_id] = useState<string[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const groupCode = params.groupId as string;
  const { users } = useGroupUsers(groupCode);

  const userIds = useMemo(() => users.map((user) => user.id), [users]);
  const { userRatings } = useFetchMovieData(userIds);
  const { allUserRatings } = useFetchAllUserRatings();

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: users.map((user) => user.id),
          user_ratings: userRatings,
          all_user_ratings: allUserRatings,
        }),
      });
      const data = await res.json();
      setRecommendation_id(data.recommendations || []);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if all required data is present and not empty
    if (
      users.length > 0 &&
      Object.keys(userRatings).length > 0 &&
      Object.keys(allUserRatings).length > 0
    ) {
      fetchRecommendations();
    }
  }, [users, userRatings, allUserRatings]);

  useEffect(() => {
    const mapped = recommendation_id
      .map((movieId, idx) => {
        const movie = moviesData.find((m) => String(m.id) === String(movieId));
        if (!movie) return null;
        return { ...movie, position: idx + 1 };
      })
      .filter(Boolean);
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setRecommendedMovies(mapped);
  }, [recommendation_id]);

  return (
    <div className="container mx-auto h-screen max-w-[95%] px-4 py-8">
      {/* Podium Section */}
      <div className="mb-16 flex max-h-[95vh] flex-col items-end justify-center gap-4 md:flex-row md:gap-8">
        {podiumData.map((item) => (
          <div
            key={item.place}
            className={`${item.order} flex flex-col items-center`}
          >
            <div className="mb-2">{item.icon}</div>
            <div className="w-full max-w-[280px]">
              {recommendedMovies[item.index] && (
                <MovieCard movie={recommendedMovies[item.index]} />
              )}
            </div>
            <div
              className={`mt-2 flex ${item.height} ${item.width} items-center justify-center rounded-t-lg bg-orange-400`}
            >
              <span className={`${item.textSize} font-bold text-black`}>
                {item.place}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Runner Ups Section */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">Runner Ups</h2>

        {/* Desktop View: Grid with 2 rows of 4 */}
        <div className="mb-8 hidden grid-cols-2 gap-6 md:grid lg:grid-cols-4">
          {recommendedMovies.slice(3, 11).map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Mobile View: Horizontal Scroll */}
        <div className="mb-8 md:hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {recommendedMovies.slice(3, 11).map((movie) => (
                <div key={movie.id} className="w-[200px] flex-shrink-0">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
