"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PasswordInput } from "@/components/auth/password-input";
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
import type { SignupFormValues } from "@/lib/schemas/auth";
import { signupSchema } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const supabase = createClient();

  // Initialize react-hook-form with Zod schema
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const [error, setError] = useState<string | null>(null);

  // Handle sign-up form submission, change URL to http://localhost:3000/callback for localhost
  const handleSignUp = async (data: SignupFormValues) => {
    setError(null);
    try {
      const { email, password } = data;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `https://movie-matcher-black.vercel.app/callback`,
        },
      });

      if (error) throw error;

      // Redirect to the sign-up success page
      router.push("/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
      role="main"
      aria-label="Sign up form"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl" id="signup-title">
            Sign up
          </CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(handleSignUp)}
            aria-labelledby="signup-title"
            aria-describedby={error ? "signup-error" : undefined}
          >
            <div className="flex flex-col gap-6">
              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    className="text-sm text-red-500"
                    id="email-error"
                    role="alert"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                {errors.password && (
                  <p
                    className="text-sm text-red-500"
                    id="password-error"
                    role="alert"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Repeat Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Repeat Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword
                      ? "confirm-password-error"
                      : undefined
                  }
                />
                {errors.confirmPassword && (
                  <p
                    className="text-sm text-red-500"
                    id="confirm-password-error"
                    role="alert"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {error && (
                <p
                  className="text-sm text-red-500"
                  id="signup-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-300"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                {isSubmitting ? "Creating an account..." : "Sign up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-orange-300"
                aria-label="Login"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
