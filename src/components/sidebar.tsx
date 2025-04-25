"use client";

import { Aperture, Film, LogOut, User, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useSignOut } from "@/hooks/handle-signout";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { handleSignOut } = useSignOut();

  const navItems = [
    { name: "Catalogue", icon: Aperture, href: "/catalogue" },
    { name: "View Profile", icon: User, href: "/profile" },
    { name: "Join Group", icon: UserPlus, href: "/join" },
  ];

  // Close sidebar when route changes on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);

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
        return;
      }

      const userId = session.user.id;

      // Insert a new group and let Supabase generate the group_id
      const { data: groupData, error: groupError } = await supabase
        .from("groups") // Replace with your Supabase table name for groups
        .insert({ host_id: userId }) // Add any other necessary fields
        .select("id") // Return the generated group_id
        .single();

      if (groupError) {
        console.error("Error creating group:", groupError.message);
        return;
      }

      const groupId = groupData.id; // Use the generated group_id

      // Add the user to the groups_users table
      const { error: userGroupError } = await supabase
        .from("groups_users") // Replace with your Supabase table name
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
      } else {
        // eslint-disable-next-line no-console
        console.log("Group created successfully:", groupId);
        router.push(`/lobby/${groupId}`); // Redirect to the lobby page
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-40 h-screen border-r bg-stone-950 text-white transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16",
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex h-16 items-center px-4">
        <Link href="/catalogue" className="flex items-center gap-2">
          <Film className="h-8 w-8 text-orange-400" />
          <span
            className={cn(
              "text-xl font-bold transition-opacity duration-200",
              isExpanded ? "opacity-100" : "opacity-0",
            )}
          >
            Aperture
          </span>
        </Link>
      </div>

      <nav className="mt-8">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 hover:bg-gray-800",
                    isActive && "bg-gray-800",
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={cn(
                      "ml-3 whitespace-nowrap transition-opacity duration-200",
                      isExpanded ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
          {/* Create Group Button */}
          <li>
            <button
              onClick={createGroup}
              className="flex w-full items-center rounded-md px-3 py-2 text-left hover:bg-gray-800"
            >
              <Users className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  "ml-3 whitespace-nowrap transition-opacity duration-200",
                  isExpanded ? "opacity-100" : "opacity-0",
                )}
              >
                Create Group
              </span>
            </button>
          </li>
          {/* Sign Out Button */}
          <li>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center rounded-md px-3 py-2 text-left hover:bg-gray-800"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  "ml-3 whitespace-nowrap transition-opacity duration-200",
                  isExpanded ? "opacity-100" : "opacity-0",
                )}
              >
                Sign Out
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
