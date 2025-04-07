import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import PWAInstallPrompt from "@/components/pwaInstall-prompt"; // ✅ Import it

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoteVerse Share Notes Effortlessly",
  description: "Share and discover educational notes with Likhit",
  themeColor: "#000000",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon_512x512.png",
    apple: "/icons/icon_192x192.png",
  },
  applicationName: "NoteVerse",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NoteVerse",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            geistSans.variable,
            geistMono.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="pt-16">{children}</main>
            <PWAInstallPrompt /> 
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
