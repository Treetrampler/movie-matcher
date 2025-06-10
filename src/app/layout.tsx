import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type React from "react";
import { Toaster } from "sonner";

import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// sets out the font used in the app, and some data for the font

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// adds some metadata for the browser

export const metadata: Metadata = {
  title: "MovieMatch - Find Your Perfect Movie",
  description:
    "Discover movies based on your unique taste profile and find perfect matches for group movie nights.",
};

// the root layout for the app, which wraps the app in a theme provider component and sets the font

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster
            richColors
            position="top-center"
            style={{ marginLeft: "32px" }} // or whatever your sidebar width is
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
