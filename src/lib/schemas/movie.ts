interface Movie {
  id: number;
  title: string;
  rating: number;
  genres: string[];
  imageUrl: string | null;
  description: string | null;
  watchLink: string | undefined;
}

export default Movie;
