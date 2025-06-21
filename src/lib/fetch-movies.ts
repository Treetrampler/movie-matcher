import fs from "node:fs";
import path from "node:path";

import fetch from "node-fetch";

const API_KEY = process.env.TMDB_API_KEY!;
const TOTAL_MOVIES = 1000;
const MOVIES_PER_PAGE = 20;
const TOTAL_PAGES = Math.ceil(TOTAL_MOVIES / MOVIES_PER_PAGE);

interface TMDBMoviePage {
  page: number;
  total_pages: number;
  total_results: number;
  results: any[];
}

async function fetchGenres() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`,
    );
    const data = await response.json();
    const genreMap = (
      data as { genres: { id: number; name: string }[] }
    ).genres.reduce((map: any, genre: any) => {
      map[genre.id] = genre.name;
      return map;
    }, {});
    return genreMap;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return {};
  }
}

function isSafeMovie(movie: any): boolean {
  const lowerTitle = movie.title?.toLowerCase() || "";
  const lowerOverview = movie.overview?.toLowerCase() || "";

  const bannedKeywords = [
    "erotic",
    "sensual",
    "seduction",
    "affair",
    "orgy",
    "incest",
    "sex",
    "sexual",
    "stripper",
    "prostitute",
    "nude",
    "nudity",
    "brothel",
    "swinger",
    "exchange",
    "pleasure",
    "fetish",
    "bdsm",
    "lust",
    "desire",
    "passion",
    "affairs",
    "mistress",
  ];

  return !bannedKeywords.some(
    (word) => lowerTitle.includes(word) || lowerOverview.includes(word),
  );
}

async function fetchWatchLink(movieId: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`,
    );
    const data = (await res.json()) as {
      results?: Record<
        string,
        {
          link?: string;
          flatrate?: any[];
        }
      >;
    };

    return data?.results?.AU?.link ?? null;
  } catch (err) {
    console.error(`Failed to fetch watch link for movie ${movieId}:`, err);
    return null;
  }
}

async function fetchMovies() {
  const allMovies: any[] = [];
  const seenIds = new Set<number>();

  try {
    const genreMap = await fetchGenres();

    // Fetch all pages concurrently
    const fetchPagePromises = Array.from({ length: TOTAL_PAGES }, (_, i) =>
      fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${i + 1}`,
      ).then((res) => res.json() as Promise<TMDBMoviePage>),
    );

    const pages = await Promise.all(fetchPagePromises);

    // Process each page's results
    for (const data of pages) {
      if (!data?.results) continue;

      const filtered = await Promise.all(
        data.results
          .filter(
            (movie: any) =>
              !seenIds.has(movie.id) &&
              movie.adult !== true &&
              movie.original_language === "en" &&
              isSafeMovie(movie),
          )
          .map(async (movie: any) => {
            seenIds.add(movie.id);
            const watchLink = await fetchWatchLink(movie.id);

            return {
              id: movie.id,
              title: movie.title,
              rating: movie.vote_average / 2,
              imageUrl: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null,
              genres: movie.genre_ids.map(
                (id: number) => genreMap[id] || "Unknown",
              ),
              description: movie.overview,
              watchLink,
            };
          }),
      );

      allMovies.push(...filtered);
    }

    // Save to a local file
    const filePath = path.join(__dirname, "../data/movies.json");
    fs.writeFileSync(filePath, JSON.stringify(allMovies, null, 2));

    const publicFilePath = path.join(
      process.cwd(),
      "public",
      "data",
      "movies.json",
    );
    fs.copyFileSync(filePath, publicFilePath);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

fetchMovies();
