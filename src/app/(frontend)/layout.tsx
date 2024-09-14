import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LoginWrapper from "../components/authWrapper";
import { ThemeProvider } from "../components/themes/provider";
import { Indicator } from "../components/themes/indicator";
import { Toaster } from "../components/ui/toaster";
import { cn } from "../lib/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bards database",
  description: "A self hosted mongodb database dashboard that borrows ideas from firebase database and its dashbaord",
  icons: {
    icon: "/bards-database.png",
    shortcut: "/bards-database.png",
    apple: "/bards-database.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable, geistMono.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <LoginWrapper>
              <div className="flex-1">{children}</div>
            </LoginWrapper>
          </div>
          <Toaster />
          <Indicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
