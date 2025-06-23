"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Label } from "@/components/ui/label";
import { updatePasswordSchema } from "@/lib/schemas/auth";
import type { UpdatePasswordFormValues } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: UpdatePasswordFormValues) => {
    setError(null);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (error) throw error;
      router.push("/catalogue");
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
      role="main"
      aria-label="Update password form"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl" id="update-password-title">
            Reset Your Password
          </CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            aria-labelledby="update-password-title"
            aria-describedby={error ? "update-password-error" : undefined}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <PasswordInput
                  id="password"
                  placeholder="New password"
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
              {error && (
                <p
                  className="text-sm text-red-500"
                  id="update-password-error"
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
                {isSubmitting ? "Saving..." : "Save new password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
