"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
import type { ForgotPasswordFormValues } from "@/lib/schemas/auth";
import { forgotPasswordSchema } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // handle the logic of sending the reset password link to the email
  const handleForgotPassword = async (data: ForgotPasswordFormValues) => {
    setError(null);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
      reset();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
      role="main"
      aria-label="Forgot password form"
    >
      {success ? (
        <Card role="alert" aria-live="polite" aria-atomic="true">
          <CardHeader>
            <CardTitle className="text-2xl" id="reset-success-title">
              Check Your Email
            </CardTitle>
            <CardDescription>Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p
              className="text-sm text-muted-foreground"
              aria-describedby="reset-success-title"
            >
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card role="form" aria-labelledby="reset-title">
          <CardHeader>
            <CardTitle className="text-2xl" id="reset-title">
              Reset Your Password
            </CardTitle>
            <CardDescription>
              Type in your email and we&apos;ll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(handleForgotPassword)}
              aria-describedby={error ? "reset-error" : undefined}
            >
              <div className="flex flex-col gap-6">
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
                {error && (
                  <p
                    className="text-sm text-red-500"
                    id="reset-error"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-orange-400 hover:bg-orange-300"
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send reset email"}
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
      )}
    </div>
  );
}
