"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { MovieCard } from "@/components/catalogue/movie-card";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import type Movie from "@/lib/schemas/movie";
import moviesData from "@/data/movies.json";
import { MovieCatalogue } from "@/components/catalogue/movie-catalogue";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<{
    email: string;
    username: string;
    avatar: string | null;
  }>({
    email: "unknown",
    username: "unknown",
    avatar: null,
  });
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
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

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();

      // 1. Get session and user
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user?.id) {
        toast.error("Could not get user session.");
        return;
      }

      const userId = session.user.id;

      // 2. Get email from auth user
      const email = session.user.email ?? null;

      // 3. Get username and avatar from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("name, avatar")
        .eq("user_id", userId)
        .single();

      if (userError) {
        toast.error("Could not fetch user profile.");
        return;
      }

      // 4. Get watched movies from user-movie-ratings table
      // After fetching watched movie IDs from Supabase:
      const { data: watched, error: watchedError } = await supabase
        .from("user-movie-data")
        .select("movie_id")
        .eq("user_id", userId);

      if (watchedError) {
        toast.error("Could not fetch watched movies.");
        return;
      }

      // Get the array of watched movie IDs
      const watchedIds = watched?.map((wm) => wm.movie_id) ?? [];

      // Filter the moviesData to only include watched movies, ensure they are the right type
      const watchedM = moviesData
        .filter((movie) => watchedIds.includes(movie.id))
        .map((movie) => ({
          ...movie,
          watchLink: movie.watchLink === null ? undefined : movie.watchLink,
        }));

      // Set the state
      setWatchedMovies(watchedM);

      setProfileData({
        email: email ?? "unknown",
        username: userData?.name ?? "unknown",
        avatar: userData?.avatar ?? null,
      });
    };

    fetchUserData();
  }, []);

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
                    src={profileData.avatar || "/placeholder.svg"}
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
                <h3 className="text-lg font-semibold">
                  {profileData.username}
                </h3>
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
                    value="*********"
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
            <div className="flex items-center justify-between px-10">
              <div>
                <CardTitle className="text-xl">Watched Movies</CardTitle>
              </div>
              <Badge variant="secondary" className="text-sm">
                {watchedMovies.length} movies
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <MovieCatalogue movies={watchedMovies} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
