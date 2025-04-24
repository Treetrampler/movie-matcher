import React from "react";
import { Sidebar } from "@/components/sidebar";
import checkUser from "@/hooks/check-user";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await checkUser();
  if (!loggedIn) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-16 flex-1 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
