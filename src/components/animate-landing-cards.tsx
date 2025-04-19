"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Film } from "lucide-react";

export default function AnimateLandingCards() {
  const { scrollYProgress } = useScroll(); // Tracks the scroll progress of the page

  // Define transformations for each card based on scroll progress
  const card1Y = useTransform(scrollYProgress, [0, 0.5], [-50, 0]); // Moves from 100px down to 0px
  const card1X = useTransform(scrollYProgress, [0, 0.5], [-50, 0]); // Moves from -50px (left) to 0px
  const card1Rotate = useTransform(scrollYProgress, [0, 0.5], [30, 0]); // Rotates from 0 to 360 degrees

  const card2Y = useTransform(scrollYProgress, [0, 0.5], [-50, 0]); // Moves from 100px down to 0px

  const card3Y = useTransform(scrollYProgress, [0, 0.5], [-50, 0]); // Moves from 100px down to 0px
  const card3X = useTransform(scrollYProgress, [0, 0.5], [50, 0]); // Moves from -50px (left) to 0px
  const card3Rotate = useTransform(scrollYProgress, [0, 0.5], [-30, 0]); // Rotates from 0 to 360 degrees

  return (
    <section id="features" className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Card 1 */}
          <motion.div
            className="rounded-lg border-1 bg-black p-8 shadow-xl"
            style={{ y: card1Y, x: card1X, rotate: card1Rotate }}
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20">
              <Film className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="mb-4 text-2xl font-bold">Personal Taste Profile</h3>
            <p className="text-lg text-gray-400">
              Rate movies you've watched and we'll build your unique taste
              profile.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="rounded-lg border-1 bg-black p-8 shadow-xl"
            style={{ y: card2Y }}
          >
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
              Create or join watch parties and find movies everyone will enjoy.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="rounded-lg border-1 bg-black p-8 shadow-xl"
            style={{ y: card3Y, x: card3X, rotate: card3Rotate }}
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
