import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface User {
  id: string;
  name: string;
  isHost: boolean;
  avatar?: string;
}

export function useGroupUsers(groupCode: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [isHost, setIsHost] = useState(false);

  const supabase = createClient();

  // Fetch initial users in the group
  const fetchUsers = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user?.id) {
        console.error(
          "Failed to retrieve user session:",
          sessionError?.message,
        );
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("groups_users")
        .select("user_id, host") // Adjust based on your schema
        .eq("group_id", groupCode);

      if (error) {
        console.error("Error fetching users:", error.message);
        return;
      }

      // Map the data to match the User interface
      const mappedUsers = data.map((entry: any) => ({
        id: entry.user_id,
        name: "test", // Replace with actual user name if available
        isHost: entry.host,
      }));

      setUsers(mappedUsers);

      // Check if the current user is the host
      const currentUser = data.find((entry: any) => entry.user_id === userId);
      if (currentUser) {
        setIsHost(currentUser.host);
      }
    } catch (err) {
      console.error("Unexpected error fetching users:", err);
    }
  };

  // Subscribe to real-time updates
  const subscribeToUsers = () => {
    const channel = supabase
      .channel("realtime:groups_users")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "groups_users",
          filter: `group_id=eq.${groupCode}`,
        },
        (payload) => {
          console.log("New user joined:", payload.new);

          // Add the new user to the state
          const newUser = {
            id: payload.new.user_id,
            name: "test", // Replace with actual user name if available
            isHost: payload.new.host,
          };

          setUsers((prevUsers) => [...prevUsers, newUser]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    // Fetch initial users when the hook is used
    fetchUsers();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUsers();

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [groupCode]);

  return { users, isHost };
}
