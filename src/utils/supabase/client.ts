import { createBrowserClient } from "@supabase/ssr";

// creates the client, abstracted for simplicity. All hooks in the utils/supabase folder are taken from supabase docs

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
