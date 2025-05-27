import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

// Result type: { [userId]: { [movieId]: rating } }
type userRatings = Record<string, Record<string, number>>;

export function useFetchMovieData(userIds: string[]) {
  const [userRatings, setUserRatings] = useState<userRatings>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userIds || userIds.length === 0) {
      setUserRatings({});
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
      const result: userRatings = {};
      rows?.forEach((row: any) => {
        if (!result[row.user_id]) result[row.user_id] = {};
        result[row.user_id][row.movie_id] = row.rating;
      });

      setUserRatings(result);
      setLoading(false);
    };

    fetchData();
  }, [userIds]);

  return { userRatings, loading, error };
}

export function useFetchAllUserRatings() {
  const [allUserRatings, setAllUserRatings] = useState<userRatings>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllRatings = async () => {
      setLoading(true);
      setError(null);
      const supabase = createClient();

      // Adjust table/column names as needed
      const { data: rows, error } = await supabase
        .from("user_movie_ratings")
        .select("user_id, movie_id, rating");

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Organize data: { userId: { movieId: rating, ... }, ... }
      const result: userRatings = {};
      rows?.forEach((row: any) => {
        if (!result[row.user_id]) result[row.user_id] = {};
        result[row.user_id][row.movie_id] = row.rating;
      });

      setAllUserRatings(result);
      setLoading(false);
    };

    fetchAllRatings();
  }, []);

  return { allUserRatings, loading, error };
}
