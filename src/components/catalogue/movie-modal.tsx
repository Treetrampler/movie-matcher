"use client";

import { ExternalLink, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/catalogue/dialogue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { saveMovieRating } from "@/hooks/save-ratings";
import type Movie from "@/lib/schemas/movie";

// Define the props for the MovieModal component
interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  userRating: number | null;
  setUserRating: (rating: number) => void;
}

export function MovieModal({
  movie,
  isOpen,
  onClose,
  userRating,
  setUserRating,
}: MovieModalProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  if (!movie) return null; // Return null if no movie is provided

  const displayRating = userRating !== null ? userRating : movie.rating; // Use user rating if available, otherwise use movie rating
  const roundedRating = Math.round(displayRating * 2) / 2;

  // Handle star click to set user rating and save it
  const handleStarClick = (star: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setUserRating(star);
    saveMovieRating(movie.id, star);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] w-[80vw] max-w-none overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-modal-title"
        aria-describedby="movie-modal-desc"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" id="movie-modal-title">
            {movie.title}
          </DialogTitle>
        </DialogHeader>

        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          id="movie-modal-desc"
        >
          {/* Movie Poster */}
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md">
            <Image
              src={movie.imageUrl || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          {/* Movie Details */}
          <div className="space-y-6 py-6">
            {/* Rating Section */}
            <div>
              <div
                className="mb-2 flex items-center"
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
                      className={`h-6 w-6 ${
                        (
                          hoverRating !== null
                            ? star <= hoverRating
                            : star <= roundedRating
                        )
                          ? "fill-black text-orange-400"
                          : "text-gray-300"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-600" aria-live="polite">
                  {userRating
                    ? `Your rating: ${userRating}`
                    : `${roundedRating.toFixed(1)}`}
                </span>
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="mb-2 text-lg font-semibold">Genres</h3>
              <div className="flex flex-wrap gap-2" aria-label="Genres">
                {movie.genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="border-gray-600"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-2 text-lg font-semibold">Description</h3>
              <p className="leading-relaxed text-white">
                {movie.description ||
                  "No description available for this movie."}
              </p>
            </div>

            {/* Where to Watch */}
            <div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(movie.watchLink, "_blank")}
                  aria-label={`Watch ${movie.title} now (opens in a new tab)`}
                >
                  Watch Now
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
