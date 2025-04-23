import { createClient } from "@/utils/supabase/server";

// simple hook to check if a user is logged in / has a current session

export default async function checkUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return false;
  }
  return true;
}
