"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

interface Movie {
  id: number;
  title: string;
  rating: number;
  genres: string[];
  imageUrl: string | null;
}

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Calculate the display rating (user rating if set, otherwise the movie's default rating)
  const displayRating = userRating !== null ? userRating : movie.rating;

  // Round to nearest 0.5 for star display
  const roundedRating = Math.round(displayRating * 2) / 2;

  // Save user rating to Supabase
  const saveRating = async (rating: number) => {
    try {
      const supabase = createClient();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user?.id) {
        console.error(
          "Failed to retrieve user session:",
          sessionError?.message,
        );
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("user-movie-data") // Replace with your Supabase table name
        .upsert(
          {
            movie_id: movie.id,
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
  };

  // Load user rating from Supabase
  const loadUserRating = async () => {
    try {
      const supabase = createClient();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user?.id) {
        console.error(
          "Failed to retrieve user session:",
          sessionError?.message,
        );
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("user-movie-data") // Replace with your Supabase table name
        .select("rating")
        .eq("movie_id", movie.id)
        .eq("user_id", userId)
        .limit(1) // just in case they have somehow bypassed the unique constraint in supabase
        .maybeSingle();

      if (error) {
        console.error("Error loading user rating:", error.message);
        return;
      }

      if (data) {
        setUserRating(data.rating);
      }
    } catch (err) {
      console.error("Unexpected error loading user rating:", err);
    }
  };

  useEffect(() => {
    loadUserRating(); // Load the user's rating when the component mounts
  }, []);

  return (
    <Card className="overflow-hidden rounded-sm border transition-shadow duration-300 hover:shadow-md">
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={movie.imageUrl || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="px-4">
        <h3 className="mb-2 line-clamp-1 text-lg font-bold">{movie.title}</h3>

        <div className="mb-3 flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="focus:outline-none"
              onClick={() => {
                setUserRating(star);
                saveRating(star);
              }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
            >
              <Star
                className={`h-5 w-5 ${
                  (
                    hoverRating !== null
                      ? star <= hoverRating
                      : star <= roundedRating
                  )
                    ? "fill-grey-800 text-orange-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {userRating
              ? `Your rating: ${userRating}`
              : `${roundedRating.toFixed(1)}`}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {movie.genres.map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
