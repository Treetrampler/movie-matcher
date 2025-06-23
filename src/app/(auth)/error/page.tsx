import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// the error page for auth routes

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div
      className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
      role="main"
      aria-label="Authentication error page"
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card role="alert" aria-live="assertive" aria-atomic="true">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-400" id="error-title">
                Sorry, something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p
                  className="text-sm text-muted-foreground"
                  aria-describedby="error-title"
                >
                  Code error: {params.error}
                </p>
              ) : (
                <p
                  className="text-sm text-muted-foreground"
                  aria-describedby="error-title"
                >
                  An unspecified error occurred.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
