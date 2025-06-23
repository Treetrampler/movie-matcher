import { Film } from "lucide-react";
import Link from "next/link";

import AnimateLandingCards from "@/components/landing-page/animate-landing-cards";
import Footer from "@/components/landing-page/footer";
import TypedHeading from "@/components/landing-page/typed-heading";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-black text-gray-100">
      {/* Header, normally would be put in layout but this is only the header for the landing page, no header for main pages */}
      <header className="fixed z-10 w-full bg-black/80 px-8 py-6 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="h-8 w-8 text-orange-500" aria-hidden="true" />
            {/* Logo plus name of app */}
            <span className="text-xl font-bold">Aperture</span>
          </div>

          {/* set up login and signup buuttons */}
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="h-10 w-30 text-gray-300 hover:bg-gray-900 hover:text-orange-400"
                aria-label="Log in"
              >
                Log In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                className="text-l h-10 w-30 bg-orange-400 text-black hover:bg-orange-300"
                aria-label="Sign up"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className="flex min-h-screen flex-1 flex-col items-center justify-center bg-[url('/bg2.jpg')] bg-cover bg-center bg-no-repeat px-4 pt-32 pb-20 text-center"
        role="main"
        aria-label="Landing page main content"
      >
        <div className="mx-auto max-w-6xl space-y-10">
          <TypedHeading />
          {/* Animated typing heading, abstracted for simplicity and also optimisation as it uses client side rendering */}
          <p
            className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl"
            id="landing-desc"
          >
            No more endless scrolling. Discover movies you'll love based on your
            unique taste profile.
          </p>
          <div className="flex flex-col justify-center gap-4 pt-4 pb-16 sm:flex-row">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="h-13 w-60 bg-orange-400 px-8 text-sm font-bold text-black hover:bg-orange-300"
                aria-label="Sign up"
              >
                Try Aperture Today
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features section, imported from a component for optimisation, as component must "use client" but we want to server side render most of the app - abstraction - give me OOP marks please :)  */}
      <AnimateLandingCards />

      {/* Footer, abstracted for ease of reading */}
      <Footer />
    </div>
  );
}
