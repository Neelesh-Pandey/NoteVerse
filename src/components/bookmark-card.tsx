"use client";


import { useState } from "react";
import { Bookmark, ExternalLink, Calendar, Star, StarOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

interface BookmarkCardProps {
  bookmark: {
    id: string;
    noteId: string;
    userId: string;
    createdAt: string;
    note: {
      id: string;
      title: string;
      description: string;
      imageUrl?: string;
      pdfUrl?: string;
      category?: string;
      createdAt: string;
      tags?: string[];
    };
  };
  onRemove: (noteId: string) => void;
}

export function BookmarkCard({bookmark, onRemove }: BookmarkCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useRouter();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewNote = () => {
    navigate.push(`/browse/${bookmark.note.id}`);
  };

 
  // Extract category as a tag if it exists
  const tags = bookmark.note.tags || [];
  if (bookmark.note.category && !tags.includes(bookmark.note.category)) {
    tags.unshift(bookmark.note.category);
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md group">
      <div className="relative">
        {bookmark.note.imageUrl ? (
          <div 
            className="h-40 bg-cover bg-center" 
            style={{ backgroundImage: `url(${bookmark.note.imageUrl})` }}
          />
        ) : (
          <div className="h-40 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <Bookmark className="h-16 w-16 text-primary/20" />
          </div>
        )}
        
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-1.5 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          {isFavorite ? (
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          ) : (
            <StarOff className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{bookmark.note.title}</CardTitle>
        <CardDescription className="line-clamp-2">{bookmark.note.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-2 pb-2">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(bookmark.note.createdAt)}</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex w-full justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => onRemove(bookmark.note.id)}
                >
                  <Bookmark className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove from bookmarks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button 
            variant="default" 
            size="sm" 
            className="text-xs"
            onClick={handleViewNote}
          >
            View Note
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
