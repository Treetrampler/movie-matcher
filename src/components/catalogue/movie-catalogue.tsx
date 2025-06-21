"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

import { MovieCard } from "@/components/catalogue/movie-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type Movie from "@/lib/schemas/movie";

export function MovieCatalogue() {
  const [movies, setMovies] = useState<Movie[]>([]); // State to store fetched movies
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("title-asc");
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const [visibleCount, setVisibleCount] = useState(20); // State to track visible movies

  const error = null; // Placeholder for error handling

  // Fetch movies from movies.json
  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("/data/movies.json");
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, []);

  // Filter movies based on search query
  const filteredMovies = movies.filter((movie) =>
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 90) {
        setVisibleCount((prevCount) => Math.min(prevCount + 20, 989)); // change 989 to the total number of movies
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Loading movies...</div>
      ) : error ? (
        <div className="py-12 text-center text-red-500">Error: {error}</div>
      ) : sortedMovies.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          No movies found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedMovies.slice(0, visibleCount).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
