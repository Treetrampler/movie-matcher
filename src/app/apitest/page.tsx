export default async function Page() {
  const response = await fetch(
    "https://movie-matcher-black.vercel.app/api/test",
  );
  const text = await response.text();

  return (
    <main>
      <h1>Flask API Response</h1>
      <p>{text}</p>
    </main>
  );
}
