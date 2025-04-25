"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/utils/supabase/client";
import { Button } from "~/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/ui/input-otp";

export default function Join() {
  const [groupId, setGroupId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleJoinGroup() {
    if (groupId.length !== 6) {
      console.error("Group ID must be 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user?.id) {
      console.error("Failed to retrieve user session:", sessionError?.message);
      setIsSubmitting(false);
      return;
    }

    const userId = session.user.id;

    try {
      // Check if the group exists
      const { data: groupData, error: groupError } = await supabase
        .from("groups") // Replace with your Supabase table name for groups
        .select("id")
        .eq("id", groupId)
        .single();

      if (groupError || !groupData) {
        console.error(
          "Group does not exist or an error occurred:",
          groupError?.message,
        );
        setIsSubmitting(false);
        return;
      }

      // Add the user to the group in the groups_users table
      const { error: userGroupError } = await supabase
        .from("groups_users") // Replace with your Supabase table name for group-user relationships
        .upsert(
          {
            group_id: groupId,
            user_id: userId,
            host: false, // Set to false since this user is joining, not creating the group
          },
          { onConflict: "group_id,user_id" },
        );

      if (userGroupError) {
        console.error("Error adding user to group:", userGroupError.message);
        setIsSubmitting(false);
        return;
      }

      // Navigate to the lobby page
      router.push(`/lobby/${groupId}`);
    } catch (error) {
      console.error("Unexpected error while joining group:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="mb-6 text-6xl font-semibold">Enter Group Code</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code provided by the group creator
          </p>
        </div>

        <div className="flex justify-center py-6">
          <InputOTP
            maxLength={6}
            value={groupId}
            onChange={setGroupId}
            className="space-x-2"
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="h-14 w-16 text-2xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="space-y-3">
          <Button
            className="h-12 w-full bg-orange-400 text-xl hover:bg-orange-300"
            onClick={handleJoinGroup}
            disabled={groupId.length !== 6 || isSubmitting}
          >
            {isSubmitting ? "Joining..." : "Join Group"}
          </Button>
        </div>
      </div>
    </div>
  );
}
