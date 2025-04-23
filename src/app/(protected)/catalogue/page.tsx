import { MovieCatalogue } from "@/components/catalogue/movie-catalogue";
import checkUser from "@/hooks/check-user";
import { redirect } from "next/navigation";

export default async function Home() {
  const loggedIn = await checkUser();
  if (!loggedIn) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black">
      <MovieCatalogue />
    </div>
  );
}
