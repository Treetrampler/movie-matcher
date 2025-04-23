import { MovieCatalogue } from "@/components/catalogue/movie-catalogue";

export default async function Home() {
  return (
    <div className="min-h-screen bg-black">
      <MovieCatalogue />
    </div>
  );
}
