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
import { createClient } from "@/utils/supabase/client";

interface Movie {
  id: number;
  title: string;
  rating: number;
  genres: string[];
  imageUrl: string;
}

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock streaming services data
const streamingServices = [
  { name: "Netflix", url: "#", available: true },
  { name: "Amazon Prime", url: "#", available: true },
  { name: "Disney+", url: "#", available: false },
  { name: "Hulu", url: "#", available: true },
  { name: "HBO Max", url: "#", available: false },
];

export function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  if (!movie) return null;

  const displayRating = userRating !== null ? userRating : movie.rating;
  const roundedRating = Math.round(displayRating * 2) / 2;

  const handleStarClick = (star: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setUserRating(star);
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-[80vw] max-w-none overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {movie.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          <div className="space-y-6">
            {/* Rating Section */}
            <div>
              <h3 className="mb-2 text-lg font-semibold">Your Rating</h3>
              <div className="mb-2 flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="focus:outline-none"
                    onClick={(e) => {
                      handleStarClick(star, e);
                      saveRating(star);
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
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
                    />
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-600">
                  {userRating
                    ? `Your rating: ${userRating}`
                    : `${roundedRating.toFixed(1)}`}
                </span>
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="mb-2 text-lg font-semibold">Genres</h3>
              <div className="flex flex-wrap gap-2">
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            {/* Where to Watch */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Where to Watch</h3>
              <div className="space-y-2">
                {streamingServices.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={
                        service.available ? "text-black" : "text-gray-400"
                      }
                    >
                      {service.name}
                    </span>
                    {service.available ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => window.open(service.url, "_blank")}
                      >
                        Watch Now
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-sm text-gray-400">
                        Not Available
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
