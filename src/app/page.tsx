import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-gray-100">
      {/* Header */}
      <header className="fixed z-10 w-full bg-black/90 px-8 py-6 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold">MovieMatch</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-gray-300 transition-colors hover:text-orange-500"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-300 transition-colors hover:text-orange-500"
            >
              How It Works
            </Link>
            <Link
              href="#about"
              className="text-gray-300 transition-colors hover:text-orange-500"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-300 hover:bg-gray-900 hover:text-orange-500"
              >
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="text-l bg-orange-400 text-black hover:bg-orange-700">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center md:py-48">
        <div className="mx-auto max-w-6xl space-y-10">
          <h1 className="text-4xl font-medium tracking-tight md:text-9xl">
            Find the perfect movie match
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl">
            No more endless scrolling. Discover movies you'll love based on your
            unique taste profile.
          </p>

          <div className="flex flex-col justify-center gap-4 pt-12 pb-16 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                className="h-13 w-60 bg-orange-400 px-8 py-6 text-sm font-bold text-black hover:bg-orange-700"
              >
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features section */}
      <section id="features" className="min-h-screen bg-gray-900 py-32">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-3xl font-bold">
            How MovieMatch Works
          </h2>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="rounded-lg bg-gray-800 p-8 shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20">
                <Film className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">
                Personal Taste Profile
              </h3>
              <p className="text-lg text-gray-400">
                Rate movies you've watched and we'll build your unique taste
                profile.
              </p>
            </div>

            <div className="rounded-lg bg-gray-800 p-8 shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl font-bold">Watch Parties</h3>
              <p className="text-lg text-gray-400">
                Create or join watch parties and find movies everyone will
                enjoy.
              </p>
            </div>

            <div className="rounded-lg bg-gray-800 p-8 shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl font-bold">Smart Recommendations</h3>
              <p className="text-lg text-gray-400">
                Our algorithm finds movies you haven't seen that match your
                preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center gap-2 md:mb-0">
              <Film className="h-6 w-6 text-orange-500" />
              <span className="font-bold">MovieMatch</span>
            </div>

            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} MovieMatch. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
