"use client";

// Import necessary libraries and components
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, ChevronRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { profileSchema } from "@/lib/schemas/profile";
import type { ProfileFormValues } from "@/lib/schemas/profile";
import { createClient } from "@/utils/supabase/client";

export default function Onboarding() {
  // State for tracking the current onboarding step
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const router = useRouter();

  // State for storing user input (name, age, activated)
  const [userInfo, setUserInfo] = useState<{ name: string; age: number }>({
    name: "",
    age: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Step 1: Profile form submit
  const onProfileSubmit = (data: ProfileFormValues) => {
    if (!agreed) {
      toast.error("You must agree to the privacy policy to continue.");
      return;
    }
    setUserInfo({ name: data.username, age: data.age });
    setCurrentStep(2);
  };

  // Step 2: Complete onboarding
  const handleComplete = async () => {
    setLoading(true);
    const supabase = createClient();

    // Get the current user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

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

    if (error) {
      toast.error(error.message || "Failed to save user information.");
      setLoading(false);
      return;
    }

    toast.success("User information saved successfully!");
    setTimeout(() => {
      router.push("/catalogue");
    }, 0);
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
            <form
              onSubmit={handleSubmit(onProfileSubmit)}
              className="space-y-4"
              role="form"
              aria-labelledby="onboarding-title"
              aria-describedby="onboarding-desc"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Your Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  {...register("username")}
                  required
                  aria-invalid={!!errors.username}
                  aria-describedby={
                    errors.username ? "username-error" : undefined
                  }
                />
                {errors.username && (
                  <p
                    className="text-sm text-red-500"
                    id="username-error"
                    role="alert"
                  >
                    {errors.username.message}
                  </p>
                )}
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
                  {...register("age", { valueAsNumber: true })}
                  required
                  aria-invalid={!!errors.age}
                  aria-describedby={errors.age ? "age-error" : undefined}
                />
                {errors.age && (
                  <p
                    className="text-sm text-red-500"
                    id="age-error"
                    role="alert"
                  >
                    {errors.age.message}
                  </p>
                )}
              </div>
              {/* Expandable Privacy Policy */}
              <div className="mb-2">
                <button
                  type="button"
                  className="text-sm text-orange-500 underline"
                  onClick={() => setShowPrivacy((prev) => !prev)}
                  aria-expanded={showPrivacy}
                  aria-controls="privacy-policy"
                >
                  {showPrivacy ? "Hide Privacy Policy" : "Show Privacy Policy"}
                </button>
                {showPrivacy && (
                  <div
                    id="privacy-policy"
                    className="mt-2 max-h-40 overflow-y-auto rounded border bg-gray-50 p-3 text-sm text-gray-700"
                    role="region"
                    aria-label="Privacy Policy"
                  >
                    <strong>Privacy Policy</strong>
                    <p>
                      We value your privacy. Your personal information (such as
                      your name, age, and movie ratings) will only be used to
                      personalize your experience on MovieMatch. We do not share
                      your data with third parties. For more details, please see
                      our full privacy policy on our website.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-4 w-4"
                  required
                  aria-checked={agreed}
                  aria-describedby="privacy-policy"
                />
                <Label htmlFor="agree" className="text-sm">
                  I have read and agree to the privacy policy
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-300"
                disabled={isSubmitting || !agreed}
                aria-disabled={isSubmitting || !agreed}
                aria-label="Agree and Continue"
              >
                Agree and Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4"
      role="main"
      aria-label="Onboarding: Rate Movies"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1
            className="mb-2 text-3xl font-bold text-orange-400"
            id="rate-movies-title"
          >
            Rate These Movies
          </h1>
          <p className="text-gray-400" id="rate-movies-desc">
            Help us understand your taste by rating these popular movies. Don't
            worry if you haven't seen some of them!
          </p>
        </div>

        <div
          className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          role="list"
          aria-labelledby="rate-movies-title"
          aria-describedby="rate-movies-desc"
        >
          {PRESET_MOVIES.map((movie) => (
            <div role="listitem" key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleComplete}
            size="lg"
            className="bg-orange-400 px-8 hover:bg-orange-300"
            disabled={loading}
            aria-disabled={loading}
            aria-label="Complete Setup"
          >
            {loading ? "Completing Setup ..." : "Complete Setup"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
