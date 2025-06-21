import { createClient } from "@/utils/supabase/client";

// Save user rating to Supabase
export async function saveMovieRating(
  movieId: number,
  rating: number,
): Promise<void> {
  try {
    const supabase = createClient();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user?.id) {
      console.error("Failed to retrieve user session:", sessionError?.message);
      return;
    }

    const userId = session.user.id;

    const { data, error } = await supabase.from("user-movie-data").upsert(
      {
        movie_id: movieId,
        user_id: userId,
        rating,
      },
      { onConflict: "movie_id,user_id" },
    );

    if (error) {
      console.error("Error saving rating:", error.message);
    } else {
      // eslint-disable-next-line no-console
      console.log("Rating saved successfully:", data);
    }
  } catch (err) {
    console.error("Unexpected error saving rating:", err);
  }
}
