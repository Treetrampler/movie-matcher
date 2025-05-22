export default async function Page() {
  const response = await fetch("http://localhost:5000/api/test");
  const text = await response.text();

  return (
    <main>
      <h1>Flask API Response</h1>
      <p>{text}</p>
    </main>
  );
}
