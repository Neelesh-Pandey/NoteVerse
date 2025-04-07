"use client";


import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  actionLabel = "Get Started", 
  onAction 
}: EmptyStateProps) {
  return (
    <Card className="w-full flex flex-col items-center justify-center p-8 border-dashed">
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <div className="mb-4 bg-muted/50 p-6 rounded-full">
          {icon}
        </div>
        <CardTitle className="text-xl mb-2.5">{title}</CardTitle>
        <CardDescription className="text-muted-foreground mb-6">
          {description}
        </CardDescription>
        {onAction && (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
