"use client";

// Import necessary libraries and components
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
import PRESET_MOVIES from "@/data/onboarding-movies";
import { createClient } from "@/utils/supabase/client";

// Define the shape of user info state
interface UserInfo {
  name: string;
  age: string;
  activated: boolean;
}

export default function Onboarding() {
  // State for tracking the current onboarding step
  const [currentStep, setCurrentStep] = useState(1);

  // State for storing user input (name, age, activated)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    age: "",
    activated: false,
  });

  // State for loading indicator
  const [loading, setLoading] = useState(false);

  // Next.js router for navigation
  const router = useRouter();

  // Handle submission of user info form (step 1)
  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.age) {
      setCurrentStep(2); // Move to the next step
    }
  };

  // Handle completion of onboarding (step 2)
  const handleComplete = async () => {
    setLoading(true);
    const supabase = createClient();

    // Get the current user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    // If session retrieval fails, show error and stop
    if (sessionError || !session?.user?.id) {
      toast.error("Failed to retrieve user session. Please log in again.");
      setLoading(false);
      return;
    }

    // Insert or update user info in the users table, setting activated to true
    const { error } = await supabase.from("users").upsert([
      {
        user_id: session.user.id,
        name: userInfo.name,
        age: userInfo.age,
        activated: true,
      },
    ]);

    // Handle any errors from the database
    if (error) {
      toast.error(error.message || "Failed to save user information.");
      setLoading(false);
      return;
    }

    // Show success, navigate to catalogue, and stop loading
    toast.success("User information saved successfully!");
    router.push("/catalogue");
    setLoading(false);
  };

  if (currentStep === 1) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-orange-400">
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
              <Button
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-300"
              >
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
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-orange-400">
            Rate These Movies
          </h1>
          <p className="text-gray-400">
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
          <Button
            onClick={handleComplete}
            size="lg"
            className="bg-orange-400 px-8 hover:bg-orange-300"
            disabled={loading}
          >
            {loading ? "Completing Setup ..." : "Complete Setup"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
