import fs from "node:fs";
import path from "node:path";

import fetch from "node-fetch";

const API_KEY = process.env.TMDB_API_KEY!;
const TOTAL_MOVIES = 1000;
const MOVIES_PER_PAGE = 20;
const TOTAL_PAGES = Math.ceil(TOTAL_MOVIES / MOVIES_PER_PAGE); // Ensure it's always an integer

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

async function fetchMovies() {
  const allMovies: any[] = [];

  try {
    const genreMap = await fetchGenres(); // Fetch genres and map them by ID
    // Fetch all pages concurrently
    const fetchPagePromises = Array.from({ length: TOTAL_PAGES }, (_, i) =>
      fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${i + 1}`,
      ).then((res) => res.json()),
    );

    const pages = await Promise.all(fetchPagePromises);

    // Process each page's results
    pages.forEach((data: any) => {
      const filtered = data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        rating: movie.vote_average / 2, // Convert 10-star to 5-star scale
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        genre_names: movie.genre_ids.map(
          (id: number) => genreMap[id] || "Unknown",
        ),
      }));
      allMovies.push(...filtered);
    });

    // Save to a local file
    const filePath = path.join(__dirname, "../data/movies.json");
    fs.writeFileSync(filePath, JSON.stringify(allMovies, null, 2));

    // eslint-disable-next-line no-console
    console.log(`Done! Saved ${allMovies.length} movies to ${filePath}`);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

fetchMovies();
