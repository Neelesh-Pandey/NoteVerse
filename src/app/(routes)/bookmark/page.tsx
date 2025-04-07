"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Bookmark } from "lucide-react";
import { BookmarkCard } from "@/components/bookmark-card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@clerk/nextjs";
import { NavigationLink } from "@/components/navigation";

// Interface for Bookmark object
interface BookmarkType {
  id: string;
  noteId: string;
  userId: string;
  createdAt: string;
  note: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    pdfUrl: string;
    category?: string;
    createdAt: string;
    tags?: string[];
  };
}
const BookmarkPage = () => {
  const { isSignedIn } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) fetchBookmarks();
  }, [isSignedIn]);

  // ✅ Fetch all bookmarks
  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/bookmark");
      setBookmarks(res.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveBookmark = async (noteId: string) => {
    try {
      await axios.delete("/api/bookmark", {
        data: { noteId },
      });

      setBookmarks((prev) => prev.filter((b) => b.note.id !== noteId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8 ">
              <NavigationLink
                href="/"
                variant="ghost"
                size="sm"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </NavigationLink>
            </div>
      {/* Header */}
      <PageHeader
        title="Bookmarked Notes"
        description="View and manage your saved notes"
        icon={<Bookmark className="h-8 w-8 text-primary" />}
      />

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-muted rounded-t-lg" />
              <div className="p-4 border border-t-0 rounded-b-lg">
                <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <EmptyState
          title="No bookmarks found"
          description="Add notes to your bookmarks to see them here"
          icon={<Bookmark className="h-12 w-12 text-muted-foreground" />}
          actionLabel="Browse Notes"
          onAction={() => console.log("Navigate to browse notes")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onRemove={handleRemoveBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkPage;
