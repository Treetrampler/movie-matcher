"use client";
import { Trophy, Medal } from "lucide-react";
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

export default function ResultsPage() {
  return (
    <div className="container mx-auto h-screen max-w-[95%] px-4 py-8">
      {/* Podium Section */}
      <div className="mb-16 flex max-h-[95vh] flex-col items-end justify-center gap-4 md:flex-row md:gap-8">
        {/* Second Place */}
        <div className="order-2 flex flex-col items-center md:order-1">
          <div className="mb-2">
            <Medal className="h-8 w-8 text-orange-400" />
          </div>
          <div className="w-full max-w-[280px]">
            <MovieCard movie={topRecommendations[1]} />
          </div>
          <div className="mt-2 flex h-16 w-[280px] items-center justify-center rounded-t-lg bg-orange-400">
            <span className="text-2xl font-bold text-black">2nd</span>
          </div>
        </div>

        {/* First Place */}
        <div className="order-1 flex flex-col items-center md:order-2">
          <div className="mb-2">
            <Trophy className="h-10 w-10 text-orange-500" />
          </div>
          <div className="w-full max-w-[280px]">
            <MovieCard movie={topRecommendations[0]} />
          </div>
          <div className="mt-2 flex h-18 w-full max-w-[500px] items-center justify-center rounded-t-lg bg-orange-400">
            <span className="text-3xl font-bold text-black">1st</span>
          </div>
        </div>

        {/* Third Place */}
        <div className="order-3 flex flex-col items-center">
          <div className="mb-2">
            <Medal className="h-8 w-8 text-orange-300" />
          </div>
          <div className="w-full max-w-[280px]">
            <MovieCard movie={topRecommendations[2]} />
          </div>
          <div className="mt-2 flex h-14 w-[280px] items-center justify-center rounded-t-lg bg-orange-400">
            <span className="text-2xl font-bold text-black">3rd</span>
          </div>
        </div>
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
