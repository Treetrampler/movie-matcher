"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type React from "react";

import { MovieModal } from "@/components/catalogue/movie-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { saveMovieRating } from "@/hooks/save-ratings";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate the display rating (user rating if set, otherwise the movie's default rating)
  const displayRating = userRating !== null ? userRating : movie.rating;

  // Round to nearest 0.5 for star display
  const roundedRating = Math.round(displayRating * 2) / 2;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on rating stars
    const target = e.target as HTMLElement;
    if (target.closest(".rating-section")) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleStarClick = (star: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setUserRating(star);
    saveMovieRating(movie.id, star);
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
    <>
      <Card
        className="shimmer-card group cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-md"
        onClick={handleCardClick}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={movie.imageUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
          />
          {/* Shimmer overlay */}
          <div className="shimmer-overlay absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <CardContent className="px-4">
          <h3 className="mb-2 line-clamp-1 text-lg font-bold">{movie.title}</h3>

          <div className="rating-section mb-3 flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="focus:outline-none"
                onClick={(e) => {
                  handleStarClick(star, e);
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
              >
                <Star
                  className={`h-5 w-5 ${
                    (
                      hoverRating !== null
                        ? star <= hoverRating
                        : star <=
                          (userRating !== null ? userRating : movie.rating)
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
      <MovieModal
        movie={{
          ...movie,
          imageUrl: movie.imageUrl ?? "/placeholder.svg",
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userRating={userRating}
        setUserRating={setUserRating}
      />
    </>
  );
}
