import React from "react";

import { Sidebar } from "@/components/sidebar";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-16 flex-1 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
