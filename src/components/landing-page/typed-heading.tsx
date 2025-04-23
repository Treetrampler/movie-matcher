"use client";
import { ReactTyped } from "react-typed";

// abstracted because it is done client side, nice UI touch
export default function TypedHeading() {
  return (
    <h1 className="text-6xl font-medium tracking-tight md:text-[8vw] xl:text-[7vw]">
      The movie night
      <br />
      {/* cycles through typing out these strings */}
      <ReactTyped
        strings={[
          "accomplice",
          "companion",
          "buddy",
          "partner",
          "sidekick",
          "pal",
          "homie",
          "co-pilot",
          "ride-or-die",
          "bestie",
          "wingman",
          "mate",
          "amigo",
          "crew",
          "teammate",
        ]}
        typeSpeed={80}
        backSpeed={100}
        backDelay={1000}
        loop
      />
    </h1>
  );
}
