"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

// Define navigation items
const navigationItems = [
  { name: "Browse", href: "/browse" },
  { name: "Create", href: "/create" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Bookmark", href: "/bookmark" },
  {name: "Leaderboard", href: "/leaderboard"},
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            Sscnp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth & Theme */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <SignedOut>
              <SignInButton>
                <button
                  className="px-4 py-2 rounded-md border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white text-sm 
                hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]
                transition duration-200"
                >
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] z-[101]"
              >
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-4 mt-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === item.href
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {isSignedIn && (
                    <>
                      <Link
                        href="/dashboard"
                        className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                    </>
                  )}

                  <SignedOut>
                    <SignInButton>
                      <button
                        className="px-4 py-2 rounded-md border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white text-sm 
                hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]
                transition duration-200"
                      >
                        Sign in
                      </button>
                    </SignInButton>
                  </SignedOut>

                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
