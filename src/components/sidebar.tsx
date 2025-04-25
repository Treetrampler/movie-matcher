"use client";

import { Aperture, Film, LogOut, User, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { useSignOut } from "@/hooks/handle-signout";
import { handleCreateGroup } from "@/hooks/handle-create-group";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const { handleSignOut } = useSignOut();
  const { createGroup } = handleCreateGroup();

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
