import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

// define the schema for a user
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

      // Fetch users in the group, including their name and avatar from the users table
      const { data, error } = await supabase
        .from("groups_users")
        .select("user_id, host, users(name, avatar)")
        .eq("group_id", groupCode);

      if (error) {
        console.error("Error fetching users:", error.message);
        return;
      }

      // Map the data to match the User interface, generating signed URLs for avatars
      const mappedUsers = await Promise.all(
        data.map(async (entry: any) => {
          // eslint-disable-next-line no-undef-init
          let avatarUrl: string | undefined = undefined;
          if (entry.users?.avatar) {
            const { data: signedUrlData } = await supabase.storage
              .from("avatars")
              .createSignedUrl(entry.users.avatar, 60 * 60);
            avatarUrl = signedUrlData?.signedUrl ?? undefined;
          }
          return {
            id: entry.user_id,
            name: entry.users?.name ?? "Unknown",
            isHost: entry.host,
            avatar: avatarUrl,
          };
        }),
      );

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
        async (payload) => {
          // Fetch the user's name from the users table using the user_id
          let userName = "Unknown";
          try {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("name")
              .eq("user_id", payload.new.user_id)
              .single();
            if (!userError && userData?.name) {
              userName = userData.name;
            }
          } catch (err) {
            console.error("Error fetching user name for new user:", err);
          }

          const newUser = {
            id: payload.new.user_id,
            name: userName,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupCode]);

  return { users, isHost, activated };
}
