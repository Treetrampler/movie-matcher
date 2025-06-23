"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createClient } from "@/utils/supabase/client";
import { Button } from "~/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/ui/input-otp";

// this page allows users to join a group using a 6-digit code

export default function Join() {
  const [groupId, setGroupId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // this function handles the join group action, called when the button is clicked

  async function handleJoinGroup() {
    if (groupId.length !== 6) {
      // the user shouldnt be able to submit anyway, but just incase it kicks them out
      console.error("Group ID must be 6 characters long.");
      return;
    }

    setIsSubmitting(true); // disables the button to stop spamming

    // retrieve the current user session and ID

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

    const userId = session.user.id; // get the id from the session

    try {
      // Check if the group exists
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .select("id, activated")
        .eq("id", groupId)
        .single();

      if (groupError || !groupData) {
        toast.error("Group not found. Please check the code and try again.");
        setIsSubmitting(false);
        return;
      }

      if (groupData.activated) {
        toast.error("Group no longer exists or has already started.");
        setIsSubmitting(false);
        return;
      }

      // Add the user to the group in the groups_users table
      const { error: userGroupError } = await supabase
        .from("groups_users")
        .upsert(
          {
            group_id: groupId,
            user_id: userId,
            host: false, // Set to false since this user is joining, not creating the group
          },
          { onConflict: "group_id,user_id" },
        );

      if (userGroupError) {
        if (
          userGroupError.message.includes(
            "new row violates row-level security policy (USING expression)",
          )
        ) {
          toast.success("Rejoined group successfully!");
          router.push(`/lobby/${groupId}`); // the user is already in this group, just push them through
        } else {
          toast.error("An error occurred");
          setIsSubmitting(false);
        }
      } else {
        // Navigate to the lobby page
        toast.success("Joined group successfully!");
        router.push(`/lobby/${groupId}`);
      }
    } catch (error) {
      console.error("Unexpected error while joining group:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-background p-2"
      role="main"
      aria-label="Join group page"
    >
      <div className="w-full max-w-xs space-y-8 sm:max-w-sm md:max-w-md">
        <div className="space-y-2 text-center">
          <h1
            className="mb-6 text-4xl font-semibold sm:text-5xl md:text-6xl"
            id="join-title"
          >
            Enter Group Code
          </h1>
          <p className="text-muted-foreground" id="join-desc">
            Enter the 6-digit code provided by the group creator
          </p>
        </div>

        <div className="flex justify-center py-6">
          <InputOTP
            maxLength={6}
            value={groupId}
            onChange={setGroupId}
            className="space-x-2"
            aria-label="Group code"
            aria-describedby="join-desc"
            aria-labelledby="join-title"
            inputMode="numeric"
            pattern="[0-9]*"
          >
            <InputOTPGroup>
              {/* map 6 digit array to the input boxes for scalability */}
              {[...Array.from({ length: 6 })].map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="h-14 w-10 text-2xl sm:w-12 md:w-16"
                  aria-label={`Digit ${index + 1}`}
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
            aria-disabled={groupId.length !== 6 || isSubmitting}
            aria-label="Join group"
          >
            {isSubmitting ? "Joining..." : "Join Group"}
          </Button>
        </div>
      </div>
    </div>
  );
}
