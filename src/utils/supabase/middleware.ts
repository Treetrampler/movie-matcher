import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// taken from supabase docs, handles session updating in the middleware (done between each request)

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/forgot-password") &&
    !request.nextUrl.pathname.startsWith("/sign-up") &&
    !request.nextUrl.pathname.startsWith("/sign-up-success") &&
    !request.nextUrl.pathname.startsWith("/error") &&
    !request.nextUrl.pathname.startsWith("/callback") &&
    !request.nextUrl.pathname.startsWith("/update-password") &&
    request.nextUrl.pathname !== "/"
  ) {
    // no user, potentially respond by redirecting the user to the login page
    console.error("Redirecting to login from middleware");
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Prevent users with activated=true from accessing /onboarding
  if (user && request.nextUrl.pathname.startsWith("/onboarding")) {
    // Query the users table for this user's activated status
    const { data, error } = await supabase
      .from("users")
      .select("activated")
      .eq("user_id", user.id)
      .single();

    if (!error && data?.activated) {
      // Redirect to dashboard or home if already onboarded/activated
      const url = request.nextUrl.clone();
      url.pathname = "/catalogue";
      return NextResponse.redirect(url);
    }
  }

  // Redirect users who have NOT completed onboarding (activated=false) to /onboarding
  if (
    user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/forgot-password") &&
    !request.nextUrl.pathname.startsWith("/sign-up") &&
    !request.nextUrl.pathname.startsWith("/sign-up-success") &&
    !request.nextUrl.pathname.startsWith("/error") &&
    !request.nextUrl.pathname.startsWith("/callback") &&
    !request.nextUrl.pathname.startsWith("/onboarding") &&
    request.nextUrl.pathname !== "/"
  ) {
    const { data, error } = await supabase
      .from("users")
      .select("activated")
      .eq("user_id", user.id)
      .single();

    if (error || (data && !data.activated)) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
