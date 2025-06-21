"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Save, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { MovieCatalogue } from "@/components/catalogue/movie-catalogue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import moviesData from "@/data/movies.json";
import type Movie from "@/lib/schemas/movie";
import type { ProfileFormValues } from "@/lib/schemas/profile";
import { profileSchema } from "@/lib/schemas/profile";
import { createClient } from "@/utils/supabase/client";

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
  const [isUploading, setIsUploading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profileData.username,
    },
  });

  const handleUsernameEdit = () => {
    setIsEditingUsername(true);
  };

  const handleUpdateUsername = async (newUsername: string) => {
    const supabase = createClient();

    // Get user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user?.id) {
      toast.error("Could not get user session.");
      return;
    }

    const userId = session.user.id;

    // Update username in Supabase
    const { error: updateError } = await supabase
      .from("users")
      .update({ name: newUsername })
      .eq("user_id", userId);

    if (updateError) {
      toast.error("Failed to update username.");
      return;
    }

    setProfileData((prev) => ({
      ...prev,
      username: newUsername,
    }));
    setIsEditingUsername(false);
    reset({ username: newUsername, age: 18 });
    toast.success("Username updated!");
  };

  const handleProfilePicUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const supabase = createClient();

    // Get user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user?.id) {
      toast.error("Could not get user session.");
      setIsUploading(false);
      return;
    }

    const userId = session.user.id;
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}.${fileExt}`;

    // Upload to Supabase Storage (private bucket)
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(uploadError.message);
      setIsUploading(false);
      return;
    }

    // Generate a signed URL (valid for 1 hour)
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage.from("avatars").createSignedUrl(filePath, 60 * 60);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      toast.error("Failed to generate avatar URL.");
      setIsUploading(false);
      return;
    }

    const avatarUrl = signedUrlData.signedUrl;

    // Update user's avatar in the users table
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar: filePath }) // Store the file path, not the signed URL
      .eq("user_id", userId);

    if (updateError) {
      toast.error(updateError.message);
      setIsUploading(false);
      return;
    }

    setProfileData((prev) => ({
      ...prev,
      avatar: avatarUrl,
    }));
    setIsUploading(false);
    toast.success("Profile picture updated!");
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

      // After fetching userData from Supabase get a signed URL for the avatar
      let avatarUrl = null;
      if (userData?.avatar) {
        const { data: signedUrlData } = await supabase.storage
          .from("avatars")
          .createSignedUrl(userData.avatar, 60 * 60);
        avatarUrl = signedUrlData?.signedUrl ?? null;
      }

      setProfileData({
        email: email ?? "unknown",
        username: userData?.name ?? "unknown",
        avatar: avatarUrl ?? null,
      });
      // Reset the form with the loaded username
      reset({
        username: userData?.name ?? "unknown",
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
                    <form
                      onSubmit={handleSubmit((data) =>
                        handleUpdateUsername(data.username),
                      )}
                      className="flex w-full items-center space-x-2"
                    >
                      <Input
                        {...register("username")}
                        className="flex-1"
                        autoFocus
                        disabled={isSubmitting}
                      />
                      <Button size="sm" type="submit" disabled={isSubmitting}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setIsEditingUsername(false);
                          reset({ username: profileData.username, age: 18 });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {errors.username && (
                        <p className="text-sm text-red-500">
                          {errors.username.message}
                        </p>
                      )}
                    </form>
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
