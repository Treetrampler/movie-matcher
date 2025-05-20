export async function GET() {
  const response = await fetch(
    "https://movie-matcher-git-main-hamishs-projects-e1ebabb3.vercel.app/api/app",
  );
  const data = await response.text();

  return new Response(data);
}
