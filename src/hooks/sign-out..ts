import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default async function handleSignOut() {
  const router = useRouter();

  try {
    const supabase = createClient();
    await supabase.auth.signOut();

    router.refresh();
  } catch (error) {
    console.error("Error signing out:", error);
  }
}
