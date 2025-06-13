"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient();

      try {
        const code = new URLSearchParams(window.location.search).get("code");
        if (!code) {
          router.push("/login");
          return;
        }
        await supabase.auth.exchangeCodeForSession(code);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user?.id) {
          router.push("/login");
          return;
        }

        // Try both "user_id" and "id" depending on your schema
        const { data, error } = await supabase
          .from("users")
          .select("onboarded")
          .eq("id", session.user.id)
          .single();

        if (error || !data) {
          // If user row doesn't exist, send to onboarding
          router.push("/onboarding");
          return;
        }

        router.push(data.onboarded ? "/dashboard" : "/onboarding");
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950">
      <Loader2 className="mb-4 h-12 w-12 animate-spin text-white" />
      <div className="h-6">
        <p className="text-lg font-medium text-white">
          logging you in ...
          <span className="animate-blink">|</span>
        </p>
      </div>
    </div>
  );
}
