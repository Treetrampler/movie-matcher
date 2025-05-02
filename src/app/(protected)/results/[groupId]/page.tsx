"use client";
import { Medal, Trophy } from "lucide-react";

import { MovieCard } from "@/components/catalogue/movie-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Mock data for recommended movies
const topRecommendations = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    rating: 4.9,
    genres: ["Drama", "Crime"],
    imageUrl: "/placeholder.svg?height=400&width=300",
    position: 1,
  },
  {
    id: 2,
    title: "The Godfather",
    rating: 4.8,
    genres: ["Crime", "Drama"],
    imageUrl: "/placeholder.svg?height=400&width=300",
    position: 2,
  },
  {
    id: 3,
    title: "The Dark Knight",
    rating: 4.7,
    genres: ["Action", "Crime", "Drama"],
    imageUrl: "/placeholder.svg?height=400&width=300",
    position: 3,
  },
];

// Exactly 8 runner-ups
const runnerUps = [
  {
    id: 4,
    title: "Pulp Fiction",
    rating: 4.5,
    genres: ["Crime", "Drama"],
    imageUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 5,
    title: "Fight Club",
    rating: 4.4,
    genres: ["Drama", "Thriller"],
    imageUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 6,
    title: "Inception",
    rating: 4.5,
    genres: ["Action", "Sci-Fi", "Thriller"],
    imageUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 7,
    title: "The Matrix",
    rating: 4.4,
    genres: ["Action", "Sci-Fi"],
    imageUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 8,
    title: "Goodfellas",
    rating: 4.5,
    genres: ["Biography", "Crime", "Drama"],
    imageUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 9,
    title: "Interstellar",
    rating: 4.6,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    imageUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 10,
    title: "The Silence of the Lambs",
    rating: 4.3,
    genres: ["Crime", "Drama", "Thriller"],
    imageUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 11,
    title: "The Departed",
    rating: 4.2,
    genres: ["Crime", "Drama", "Thriller"],
    imageUrl: "/placeholder.svg?height=400&width=300",
  },
].slice(0, 8); // Ensure exactly 8 runner-ups

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
  return (
    <div className="container mx-auto h-screen max-w-[95%] px-4 py-8">
      {/* Podium Section */}
      <div className="mb-16 flex max-h-[95vh] flex-col items-end justify-center gap-4 md:flex-row md:gap-8">
        {podiumData.map((item) => (
          <div
            key={item.place}
            className={`${item.order} flex flex-col items-center`}
          >
            <div className="mb-2">{item.icon}</div>
            <div className="w-full max-w-[280px]">
              <MovieCard movie={topRecommendations[item.index]} />
            </div>
            <div
              className={`mt-2 flex ${item.height} ${item.width} items-center justify-center rounded-t-lg bg-orange-400`}
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
        <h2 className="mb-6 text-2xl font-bold">Runner Ups</h2>

        {/* Desktop View: Grid with 2 rows of 4 */}
        <div className="mb-8 hidden grid-cols-2 gap-6 md:grid lg:grid-cols-4">
          {runnerUps.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Mobile View: Horizontal Scroll */}
        <div className="mb-8 md:hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {runnerUps.map((movie) => (
                <div key={movie.id} className="w-[200px] flex-shrink-0">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
