import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

// Result type: { [userId]: { [movieId]: rating } }
type MovieRatings = Record<string, Record<string, number>>;

export function useFetchMovieData(userIds: string[]) {
  const [data, setData] = useState<MovieRatings>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userIds || userIds.length === 0) {
      setData({});
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const supabase = createClient();

      // Adjust table/column names as needed
      const { data: rows, error } = await supabase
        .from("user_movie_ratings")
        .select("user_id, movie_id, rating")
        .in("user_id", userIds);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Organize data: { userId: { movieId: rating, ... }, ... }
      const result: MovieRatings = {};
      rows?.forEach((row: any) => {
        if (!result[row.user_id]) result[row.user_id] = {};
        result[row.user_id][row.movie_id] = row.rating;
      });

      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [userIds]);

  return { data, loading, error };
}
