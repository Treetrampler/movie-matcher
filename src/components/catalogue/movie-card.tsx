"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type React from "react";

import { MovieModal } from "@/components/catalogue/movie-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { saveMovieRating } from "@/hooks/save-ratings";
import type Movie from "@/lib/schemas/movie";
import { createClient } from "@/utils/supabase/client";

// Define the props for the MovieCard component
interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on rating stars
    const target = e.target as HTMLElement;
    if (target.closest(".rating-section")) {
      return;
    }
    setIsModalOpen(true);
  };

  // Handle star click to set user rating and save it
  const handleStarClick = (star: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setUserRating(star);
    saveMovieRating(movie.id, star);
  };

  // Load user rating from Supabase
  const loadUserRating = async () => {
    try {
      const supabase = createClient();

      // Get the current user session
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

      // Fetch the user's rating for this movie
      const { data, error } = await supabase
        .from("user-movie-data")
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
        role="region"
        aria-label={`Movie card for ${movie.title}`}
        tabIndex={0}
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
          <h3
            className="mb-2 line-clamp-1 text-lg font-bold"
            id={`movie-title-${movie.id}`}
          >
            {movie.title}
          </h3>

          <div
            className="rating-section mb-3 flex items-center"
            role="group"
            aria-label={`Rate ${movie.title}`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="focus:outline-none"
                onClick={(e) => {
                  handleStarClick(star, e);
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                aria-label={`Set rating to ${star} for ${movie.title}`}
                aria-pressed={userRating === star}
                tabIndex={0}
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
                  aria-hidden="true"
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600" aria-live="polite">
              {userRating
                ? `Your rating: ${userRating}`
                : movie.rating.toFixed(1)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1" aria-label="Genres">
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
          watchLink: movie.watchLink ?? "",
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userRating={userRating}
        setUserRating={setUserRating}
      />
    </>
  );
}
