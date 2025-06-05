import type { NextRequest } from "next/server";

import { updateSession } from "@/utils/supabase/middleware";

// the actual middleware, pulls from the supabase middleware

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// applies this function to all routes except the ones specified in the config

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
