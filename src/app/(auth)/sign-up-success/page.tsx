import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// signup success page, if a user has successfully signed up it lets them know to confirm their email

export default function Page() {
  return (
    <div
      className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
      role="main"
      aria-label="Sign up success page"
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card role="status" aria-live="polite" aria-atomic="true">
            <CardHeader>
              <CardTitle className="text-2xl" id="signup-success-title">
                Thank you for signing up!
              </CardTitle>
              <CardDescription>Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent>
              <p
                className="text-sm text-muted-foreground"
                aria-describedby="signup-success-title"
              >
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
