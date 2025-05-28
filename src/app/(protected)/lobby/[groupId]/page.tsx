"use client";

import { Crown, UserIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGroupUsers } from "@/hooks/fetch-users-group";

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const groupCode = params.groupId as string;

  const { users, isHost } = useGroupUsers(groupCode);

  const handleStartSession = () => {
    setIsLoading(true);
    // In a real app, you would make an API call to start the session
    setTimeout(() => {
      router.push(`/results/${groupCode}`);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header with group code */}
      <header className="py-12 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-xl font-medium">Join Code</h2>
          <div className="mb-8">
            <p className="text-6xl font-bold tracking-wider text-orange-400 md:text-7xl">
              {groupCode}
            </p>
          </div>
          <p className="text-gray-300">
            Share this code with friends to join your group
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto flex-1 px-4 py-8">
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xl font-semibold">
            Waiting for everyone to join...
          </h2>

          {/* Users list */}
          <div className="mx-auto grid max-w-2xl gap-4">
            {users.map((user) => (
              <Card
                key={user.id}
                className="flex flex-row items-center border-none bg-neutral-900 p-4"
              >
                {user.avatar ? (
                  <div className="mr-4 h-10 w-10 overflow-hidden rounded-full">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800">
                    <UserIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-white">{user.name}</p>
                </div>
                {user.isHost && (
                  <Crown
                    className="mr-4 h-5 w-5 text-orange-400"
                    aria-label="Host"
                  />
                )}
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer with start button */}
      <footer className="pb-6">
        <div className="container mx-auto px-4 text-center">
          {isHost ? (
            <Button
              onClick={handleStartSession}
              disabled={isLoading}
              className="h-15 w-80 bg-orange-400 px-8 py-6 text-lg text-black hover:bg-orange-300"
            >
              {isLoading ? "Starting..." : "Start Movie Night"}
            </Button>
          ) : (
            <p className="text-gray-400">
              Waiting for host to start the session...
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
