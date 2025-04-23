import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import checkUser from "@/hooks/check-user";

export default async function ProtectedPage() {
  const isUser = await checkUser();
  if (!isUser) {
    redirect("/login");
  }

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <p>Hello</p>
      <LogoutButton />
    </div>
  );
}
