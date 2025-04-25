import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function useSignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();

      router.refresh(); // Refresh the page after signing out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { handleSignOut };
}
