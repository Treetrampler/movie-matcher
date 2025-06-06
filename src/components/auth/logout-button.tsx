"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  // Function to handle logout, supabase handles logic + session
  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
