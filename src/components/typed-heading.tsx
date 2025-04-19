"use client";
import { ReactTyped } from "react-typed";

export default function TypedHeading() {
  return (
    <h1 className="text-4xl font-medium tracking-tight md:text-9xl">
      The movie night
      <br />
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
