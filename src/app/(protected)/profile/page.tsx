"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Upload, Edit2, Save, X } from "lucide-react";
import { watch } from "fs";
import { MovieCard } from "@/components/catalogue/movie-card";

// Mock data for watched movies
const watchedMovies = [
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

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    username: "moviebuff2024",
    email: "john.doe@example.com",
    password: "••••••••",
    profilePic: "/placeholder.svg?height=120&width=120",
  });

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(profileData.username);
  const [isUploading, setIsUploading] = useState(false);

  const handleUsernameEdit = () => {
    setIsEditingUsername(true);
    setTempUsername(profileData.username);
  };

  const handleUsernameSave = () => {
    setProfileData((prev) => ({ ...prev, username: tempUsername }));
    setIsEditingUsername(false);
  };

  const handleUsernameCancel = () => {
    setTempUsername(profileData.username);
    setIsEditingUsername(false);
  };

  const handleProfilePicUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileData((prev) => ({
            ...prev,
            profilePic: e.target?.result as string,
          }));
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const averageRating =
    watchedMovies.reduce((sum, movie) => sum + movie.rating, 0) /
    watchedMovies.length;

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl space-y-8 px-4">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">My Profile</CardTitle>
            <CardDescription>
              Manage your account settings and movie preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profileData.profilePic || "/placeholder.svg"}
                    alt="Profile picture"
                  />
                  <AvatarFallback className="text-2xl">
                    {profileData.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-upload"
                  className="absolute -right-2 -bottom-2 cursor-pointer"
                >
                  <div className="rounded-full bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90">
                    <Upload className="h-4 w-4" />
                  </div>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicUpload}
                    disabled={isUploading}
                  />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">
                  Click the upload icon to change your profile picture
                </p>
              </div>
            </div>

            <Separator />

            {/* Profile Information */}
            <div className="grid gap-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex items-center space-x-2">
                  {isEditingUsername ? (
                    <>
                      <Input
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleUsernameSave}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleUsernameCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        value={profileData.username}
                        disabled
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleUsernameEdit}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input value={profileData.email} disabled />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="password"
                    value={profileData.password}
                    disabled
                    className="flex-1"
                  />
                  <Button size="sm" variant="outline">
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Watched Movies Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Watched Movies</CardTitle>
                <CardDescription>
                  Movies you've rated • {watchedMovies.length} total • Average
                  rating: {averageRating.toFixed(1)}/5
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {watchedMovies.length} movies
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {watchedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
