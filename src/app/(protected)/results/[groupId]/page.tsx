"use client";
import { Loader2, Medal, Trophy } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { MovieCard } from "@/components/catalogue/movie-card";
import moviesData from "@/data/movies.json"; // This should be an array of movie objects
import {
  useFetchAllUserRatings,
  useFetchMovieData,
} from "@/hooks/fetch-movie-data";
import { useGroupUsers } from "@/hooks/fetch-users-group";

// abstract the presets for the podium to avoid repetition

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
  const [loading, setLoading] = useState(true);

  const groupCode = params.groupId as string; // get the group code from the URL parameters
  const { users } = useGroupUsers(groupCode); // fetch users in the group

  const userIds = useMemo(() => users.map((user) => user.id), [users]); // extract user IDs from the users array
  const { userRatings } = useFetchMovieData(userIds);
  const { allUserRatings } = useFetchAllUserRatings();

  const fetchRecommendations = async () => {
    // fetch recommendations from the backend
    try {
      const res = await fetch("http://localhost:5000/api/recommend", {
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
      Object.keys(userRatings) &&
      Object.keys(allUserRatings).length > 0
    ) {
      fetchRecommendations();
    }
  }, [users, userRatings, allUserRatings]);

  useEffect(() => {
    // map the recommendation IDs to movie objects
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

  // get the top rated movies as a fallback if there are no recommendations

  const topRatedMovies = useMemo(() => {
    return [...moviesData]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 50)
      .map((movie, idx) => ({ ...movie, position: idx + 1 }));
  }, [moviesData]);

  const moviesToDisplay = useMemo(() => {
    // 1. Collect all watched movie IDs from all users
    const watchedIds = new Set(
      Object.values(userRatings)
        .flatMap((ratingsObj) => Object.keys(ratingsObj))
        .map((id) => Number(id)),
    );

    // 2. Combine recommended and topRatedMovies, removing duplicates
    const combined = [
      ...recommendedMovies,
      ...topRatedMovies.filter(
        (m) => !recommendedMovies.some((rm) => rm.id === m.id),
      ),
    ];

    // 3. Filter out watched movies and take the first 11
    return combined.filter((movie) => !watchedIds.has(movie.id)).slice(0, 11);
  }, [recommendedMovies, topRatedMovies, userRatings]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-neutral-950"
        role="main"
        aria-label="Loading results"
      >
        <Loader2
          className="mb-4 h-12 w-12 animate-spin text-white"
          aria-hidden="true"
        />
        <div className="h-6">
          <p
            className="text-lg font-medium text-white"
            role="status"
            aria-live="polite"
          >
            loading results...
            <span className="animate-blink">|</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden bg-background px-0 py-8"
      role="main"
      aria-label="Group Results Page"
    >
      <div className="mx-auto w-full max-w-2xl px-2 md:max-w-7xl md:px-4">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Top Movie Recommendations
        </h1>
        {/* Mobile: vertical list */}
        <div
          className="flex flex-col gap-6 md:hidden"
          role="list"
          aria-label="Recommended Movies"
        >
          {/* Podium Movies */}
          {podiumData.map((item) =>
            moviesToDisplay[item.index] ? (
              <div
                key={item.place}
                className="flex flex-col items-center border-b pb-6"
                role="listitem"
                aria-label={`${item.place} place`}
              >
                <div className="mb-2">{item.icon}</div>
                <div className="w-full">
                  <MovieCard movie={moviesToDisplay[item.index]} />
                </div>
                <div
                  className={`mt-2 flex ${item.height} w-full items-center justify-center rounded-t-lg bg-orange-400`}
                >
                  <span className={`${item.textSize} font-bold text-black`}>
                    {item.place}
                  </span>
                </div>
              </div>
            ) : null,
          )}

          {/* Runner Ups */}
          {moviesToDisplay.slice(3, 11).map((movie, idx) => (
            <div
              key={movie.id}
              className="flex flex-col items-center border-b pb-6"
              role="listitem"
              aria-label={`Runner up ${idx + 4}`}
            >
              <div className="w-full">
                <MovieCard movie={movie} />
              </div>
              <div className="mt-2 flex w-full items-center justify-center">
                <span className="text-lg font-semibold text-gray-400">
                  Runner Up
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop: podium row and runner up grid */}
        <div className="hidden md:block">
          {/* Podium Section */}
          <div
            className="mb-16 flex max-h-[95vh] w-full flex-col items-end justify-center gap-4 md:flex-row md:gap-8"
            aria-label="Top 3 Movies Podium"
            role="region"
          >
            {podiumData.map((item) => (
              <div
                key={item.place}
                className={`${item.order} flex w-full max-w-xs flex-col items-center sm:max-w-sm md:max-w-[250px]`}
                aria-label={`${item.place} place`}
                role="group"
              >
                <div className="mb-2">{item.icon}</div>
                <div className="w-full">
                  {moviesToDisplay[item.index] && (
                    <MovieCard movie={moviesToDisplay[item.index]} />
                  )}
                </div>
                <div
                  className={`mt-2 flex ${item.height} w-full items-center justify-center rounded-t-lg bg-orange-400`}
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
            <h2 className="mb-6 text-2xl font-bold" id="runner-ups-title">
              Runner Ups
            </h2>
            <div
              className="mb-8 grid grid-cols-2 gap-6 lg:grid-cols-4"
              role="list"
              aria-labelledby="runner-ups-title"
            >
              {moviesToDisplay.slice(3, 11).map((movie) => (
                <div key={movie.id} role="listitem">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
