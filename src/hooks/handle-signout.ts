import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/utils/supabase/client";

export function useSignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Logged out successfully!");
      router.refresh(); // Refresh the page after signing out
    } catch (error) {
      toast.error("Sign out failed");
      console.error("Error signing out:", error);
    }
  };

  return { handleSignOut };
}
