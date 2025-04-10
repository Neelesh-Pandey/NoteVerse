"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
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
  { name: "Leaderboard", href: "/leaderboard" },
];

// Desktop breakpoint in pixels
const DESKTOP_BREAKPOINT = 768;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  
  // Derive desktop/mobile from viewport width
  const isDesktop = viewportWidth >= DESKTOP_BREAKPOINT;

  // Function to update viewport width
  const updateViewportWidth = useCallback(() => {
    if (typeof window !== "undefined") {
      setViewportWidth(window.innerWidth);
    }
  }, []);

  // Initialize and handle resize
  useEffect(() => {
    // Set mounted to true for hydration completion
    setMounted(true);
    
    // Set initial viewport width
    updateViewportWidth();
    
    // Add resize listener
    window.addEventListener("resize", updateViewportWidth);
    
    // Clean up
    return () => {
      window.removeEventListener("resize", updateViewportWidth);
    };
  }, [updateViewportWidth]);

  // Close menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            NoteVerse
          </Link>

          {/* Conditionally render based on isDesktop */}
          {isDesktop ? (
            <>
              {/* Desktop Navigation */}
              <div className="flex items-center space-x-8">
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
              <div className="flex items-center space-x-4">
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
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </>
          ) : (
            /* Mobile Menu Button and Controls */
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="mr-1"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Mobile - UserButton outside Sheet for easy accessibility */}
              <SignedIn>
                <div className="flex items-center mr-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>

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

                  <nav className="flex flex-col space-y-4 mt-6">
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

                    {/* For mobile - Show sign in button inside sheet */}
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
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}