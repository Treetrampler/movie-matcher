"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
              onClick={() => setUserRating(star)}
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
