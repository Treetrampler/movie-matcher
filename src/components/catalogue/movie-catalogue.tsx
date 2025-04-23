"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MovieCard } from "@/components/catalogue/movie-card";

// Mock data for movie cards
const mockMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    rating: 4.7,
    genres: ["Drama", "Crime"],
    imageUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    title: "The Godfather",
    rating: 4.8,
    genres: ["Crime", "Drama"],
    imageUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    title: "The Dark Knight",
    rating: 4.6,
    genres: ["Action", "Crime", "Drama"],
    imageUrl: "/placeholder.svg?height=400&width=300",
  },
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
    imageUrl: "/fightclub.jpg",
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
];

export function MovieCatalogue() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("title-asc");

  // Filter movies based on search query
  const filteredMovies = mockMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort movies based on selected option
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortOption) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "rating-asc":
        return a.rating - b.rating;
      case "rating-desc":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto max-w-[95%] px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-grow">
          <Search
            className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500"
            size={18}
          />
          <Input
            className="border-gray-300 pl-10 focus:border-black focus:ring-black"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-gray-700" />
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px] border-gray-300 focus:border-black focus:ring-black">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
              <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {sortedMovies.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No movies found matching your search.
        </div>
      )}
    </div>
  );
}
