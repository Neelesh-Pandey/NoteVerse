"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function NavigationLink({
  href,
  children,
  className,
  variant = "default",
  size = "default",
}: NavigationProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn("transition-all duration-200", className)}
    >
      {children}
    </Button>
  );
}
