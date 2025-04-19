import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";
import TypedHeading from "@/components/typed-heading";
import AnimateLandingCards from "@/components/animate-landing-cards";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-gray-100">
      {/* Header */}
      <header className="fixed z-10 w-full bg-black/80 px-8 py-6 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold">MovieMatch</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="h-10 w-30 text-gray-300 hover:bg-gray-900 hover:text-orange-500"
              >
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="text-l h-10 w-30 bg-orange-400 text-black hover:bg-orange-700">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-48 pb-50 text-center">
        <div className="mx-auto max-w-6xl space-y-10">
          <TypedHeading />
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
                Try MovieMatch Today
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features section */}
      <AnimateLandingCards />

      {/* Footer */}
      <footer className="border-t py-8">
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
