"use client";

import { Calendar, ChevronRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

import { MovieCard } from "@/components/catalogue/movie-card";
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
import { createClient } from "@/utils/supabase/client";

interface UserInfo {
  name: string;
  age: string;
}

interface Movie {
  id: number;
  title: string;
  rating: number;
  imageUrl: string;
  genres: string[];
}

const PRESET_MOVIES: Movie[] = [
  {
    id: 278,
    title: "The Shawshank Redemption",
    rating: 4.354,
    imageUrl: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    genres: ["Drama", "Crime"],
  },
  {
    id: 680,
    title: "Pulp Fiction",
    rating: 4.2445,
    imageUrl: "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
    genres: ["Thriller", "Crime"],
  },
  {
    id: 155,
    title: "The Dark Knight",
    rating: 4.2595,
    imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    genres: ["Drama", "Action", "Crime", "Thriller"],
  },
  {
    id: 13,
    title: "Forrest Gump",
    rating: 4.234,
    imageUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    genres: ["Comedy", "Drama", "Romance"],
  },
  {
    id: 27205,
    title: "Inception",
    rating: 4.184,
    imageUrl: "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
    genres: ["Action", "Science Fiction", "Adventure"],
  },
  {
    id: 920,
    title: "Cars",
    rating: 3.497,
    imageUrl: "https://image.tmdb.org/t/p/w500/2Touk3m5gzsqr1VsvxypdyHY5ci.jpg",
    genres: ["Animation", "Adventure", "Comedy", "Family"],
  },
  {
    id: 597,
    title: "Titanic",
    rating: 3.9525,
    imageUrl: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    genres: ["Drama", "Romance"],
  },
  {
    id: 603,
    title: "The Matrix",
    rating: 4.112,
    imageUrl: "https://image.tmdb.org/t/p/w500/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg",
    genres: ["Action", "Science Fiction"],
  },
  {
    id: 299536,
    title: "Avengers: Infinity War",
    rating: 4.1175,
    imageUrl: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    genres: ["Adventure", "Action", "Science Fiction"],
  },
  {
    id: 157336,
    title: "Interstellar",
    rating: 4.25,
    imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    genres: ["Adventure", "Drama", "Science Fiction"],
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", age: "" });
  const router = useRouter();

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.age) {
      setCurrentStep(2);
    }
  };

  const handleComplete = async () => {
    const supabase = createClient();
    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user?.id) {
      toast.error("Failed to retrieve user session. Please log in again.");
      return;
    }

    // Insert user info into the users table
    const { error } = await supabase.from("users").upsert([
      {
        user_id: session.user.id,
        name: userInfo.name,
        age: userInfo.age,
      },
    ]);

    if (error) {
      toast.error(error.message || "Failed to save user information.");
      return;
    }

    toast.success("User information saved successfully!");
    router.push("/catalogue");
  };

  if (currentStep === 1) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Welcome to MovieMatch!
            </CardTitle>
            <CardDescription>
              Let's get to know you better to create your perfect movie
              recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUserInfoSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Your Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={userInfo.name}
                  onChange={(e) =>
                    setUserInfo((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Your Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  min="13"
                  max="120"
                  value={userInfo.age}
                  onChange={(e) =>
                    setUserInfo((prev) => ({ ...prev, age: e.target.value }))
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Rate These Movies</h1>
          <p className="text-gray-600">
            Help us understand your taste by rating these popular movies. Don't
            worry if you haven't seen some of them!
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PRESET_MOVIES.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <div className="text-center">
          <Button onClick={handleComplete} size="lg" className="px-8">
            Complete Setup
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
