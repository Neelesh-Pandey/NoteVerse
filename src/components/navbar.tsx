"use client";
import { useState, useEffect } from "react";
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);

    // Check window size on mount
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Set up event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Reset menu state when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Explicitly set the display based on screen size, not just CSS media queries
  const navClassName =
    "fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-sm border-b";

  return (
    <nav className={navClassName}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            NoteVerse
          </Link>

          {/* Desktop Navigation */}
          <div
            className={`${isMobile ? "hidden" : "flex"} items-center space-x-8`}
          >
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
          <div
            className={`${isMobile ? "hidden" : "flex"} items-center space-x-4`}
          >
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
          <div
            className={`${isMobile ? "flex" : "hidden"} items-center space-x-4`}
          >
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
