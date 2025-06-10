import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

interface User {
  id: string;
  name: string;
  isHost: boolean;
  avatar?: string;
}

// this function is abstracted to improve the readability of the group page

export function useGroupUsers(groupCode: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [activated, setActivated] = useState<boolean | null>(null);

  const supabase = createClient();

  //  function to fetch initial users in the group
  const fetchUsers = async () => {
    try {
      // Retrieve the current user session and ID
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

      const userId = session.user.id; // get the user id

      // get the users in the group including host info

      const { data, error } = await supabase
        .from("groups_users")
        .select("user_id, host")
        .eq("group_id", groupCode);

      if (error) {
        console.error("Error fetching users:", error.message);
        return;
      }

      // Map the data to match the User interface (this is a schema type thing)
      const mappedUsers = data.map((entry: any) => ({
        id: entry.user_id,
        name: "test", // Replace with actual user name later ***** NOT DONE YET *****
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

  // Fetch initial activated value
  const fetchActivated = async () => {
    try {
      const { data, error } = await supabase
        .from("groups")
        .select("activated")
        .eq("id", groupCode)
        .single();

      if (error) {
        console.error("Error fetching group activation:", error.message);
        return;
      }

      setActivated(data?.activated ?? null);
    } catch (err) {
      console.error("Unexpected error fetching group activation:", err);
    }
  };

  // Subscribe to real-time updates so that when a new user joins the group, the page updates (supabase function)
  const subscribeToUsers = () => {
    // subscribe to supabase channel
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
          // Add the new user to the state
          const newUser = {
            id: payload.new.user_id,
            name: "test", // Replace with actual user name *** NOT DONE YET ***
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

  // Subscribe to real-time updates for activated column in groups table
  const subscribeToActivated = () => {
    const channel = supabase
      .channel("realtime:groups_activated")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "groups",
          filter: `id=eq.${groupCode}`,
        },
        (payload) => {
          setActivated(payload.new.activated);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    fetchUsers();
    fetchActivated();

    const unsubscribeUsers = subscribeToUsers();
    const unsubscribeActivated = subscribeToActivated();

    return () => {
      unsubscribeUsers();
      unsubscribeActivated();
    };
  }, [groupCode]);

  return { users, isHost, activated };
}
