import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/utils/supabase/client";

// abstracted function to create a group, taken out of sidebar.tsx to improve readability

export function handleCreateGroup() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  // function to create group

  async function createGroup() {
    try {
      const supabase = createClient();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user?.id) {
        console.error(
          "Failed to retrieve user session:",
          sessionError?.message,
        );
        toast.error("Failed to create group.");
        return;
      }

      const userId = session.user.id;

      // Insert a new group and let Supabase generate the group_id using prewritten functions and triggers in supabase that generate random 6 digit code
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert({ host_id: userId, activated: false })
        .select("id") // Return the generated group_id
        .single();

      if (groupError) {
        toast.error("Failed to create group.");
        console.error("Error creating group:", groupError.message);
        return;
      }

      const groupId = groupData.id; // Use the generated group_id

      // Add the user to the groups_users table
      const { error: userGroupError } = await supabase
        .from("groups_users")
        .upsert(
          {
            group_id: groupId,
            user_id: userId,
            host: true,
          },
          { onConflict: "group_id,user_id" },
        );

      if (userGroupError) {
        console.error("Error adding user to group:", userGroupError.message);
        toast.error("Failed to create group.");
      } else {
        toast.success("Group created successfully!");
        router.push(`/lobby/${groupId}`); // Redirect to the lobby page
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group.");
    }
  }

  return { createGroup };
}
