import type Movie from "@/lib/schemas/movie";

const PRESET_MOVIES: Movie[] = [
  {
    id: 278,
    title: "The Shawshank Redemption",
    rating: 4.356,
    imageUrl: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    genres: ["Drama", "Crime"],
    description:
      "Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.",
    watchLink:
      "https://www.themoviedb.org/movie/278-the-shawshank-redemption/watch?locale=AU",
  },
  {
    id: 680,
    title: "Pulp Fiction",
    rating: 4.244,
    imageUrl: "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
    genres: ["Thriller", "Crime"],
    description:
      "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    watchLink:
      "https://www.themoviedb.org/movie/680-pulp-fiction/watch?locale=AU",
  },
  {
    id: 155,
    title: "The Dark Knight",
    rating: 4.26,
    imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    genres: ["Drama", "Action", "Crime", "Thriller"],
    description:
      "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    watchLink:
      "https://www.themoviedb.org/movie/155-the-dark-knight/watch?locale=AU",
  },
  {
    id: 13,
    title: "Forrest Gump",
    rating: 4.234,
    imageUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    genres: ["Comedy", "Drama", "Romance"],
    description:
      "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.",
    watchLink:
      "https://www.themoviedb.org/movie/13-forrest-gump/watch?locale=AU",
  },
  {
    id: 27205,
    title: "Inception",
    rating: 4.1845,
    imageUrl: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    genres: ["Action", "Science Fiction", "Adventure"],
    description:
      "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
    watchLink:
      "https://www.themoviedb.org/movie/27205-inception/watch?locale=AU",
  },
  {
    id: 920,
    title: "Cars",
    rating: 3.5,
    imageUrl: "https://image.tmdb.org/t/p/w500/2Touk3m5gzsqr1VsvxypdyHY5ci.jpg",
    genres: ["Animation", "Adventure", "Comedy", "Family"],
    description:
      "Lightning McQueen, a hotshot rookie race car driven to succeed, discovers that life is about the journey, not the finish line, when he finds himself unexpectedly detoured in the sleepy Route 66 town of Radiator Springs. On route across the country to the big Piston Cup Championship in California to compete against two seasoned pros, McQueen gets to know the town's offbeat characters.",
    watchLink: "https://www.themoviedb.org/movie/920-cars/watch?locale=AU",
  },
  {
    id: 597,
    title: "Titanic",
    rating: 3.953,
    imageUrl: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    genres: ["Drama", "Romance"],
    description:
      "101-year-old Rose DeWitt Bukater tells the story of her life aboard the Titanic, 84 years later. A young Rose boards the ship with her mother and fiancé. Meanwhile, Jack Dawson and Fabrizio De Rossi win third-class tickets aboard the ship. Rose tells the whole story from Titanic's departure through to its death—on its first and last voyage—on April 15, 1912.",
    watchLink: "https://www.themoviedb.org/movie/597-titanic/watch?locale=AU",
  },
  {
    id: 603,
    title: "The Matrix",
    rating: 4.1135,
    imageUrl: "https://image.tmdb.org/t/p/w500/p96dm7sCMn4VYAStA6siNz30G1r.jpg",
    genres: ["Action", "Science Fiction"],
    description:
      "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    watchLink:
      "https://www.themoviedb.org/movie/603-the-matrix/watch?locale=AU",
  },
  {
    id: 299536,
    title: "Avengers: Infinity War",
    rating: 4.1185,
    imageUrl: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    genres: ["Adventure", "Action", "Science Fiction"],
    description:
      "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos. A despot of intergalactic infamy, his goal is to collect all six Infinity Stones, artifacts of unimaginable power, and use them to inflict his twisted will on all of reality. Everything the Avengers have fought for has led up to this moment - the fate of Earth and existence itself has never been more uncertain.",
    watchLink:
      "https://www.themoviedb.org/movie/299536-avengers-infinity-war/watch?locale=AU",
  },
  {
    id: 157336,
    title: "Interstellar",
    rating: 4.2275,
    imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    genres: ["Adventure", "Drama", "Science Fiction"],
    description:
      "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    watchLink:
      "https://www.themoviedb.org/movie/157336-interstellar/watch?locale=AU",
  },
];

export default PRESET_MOVIES;
