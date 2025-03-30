"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { NoteList } from "./_components/NoteList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";

interface User {
  name: string | null;
  email: string;
  imageUrl: string | null;
}

interface Note {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
  user: User;
  upvotes: number;
  createdAt: string;
}

export default function BrowsePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Debounce search input to avoid frequent API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  // ✅ Fetch Notes with Search and Sort
  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/notes", {
          params: { search: debouncedSearch, sort: sortBy, page },
        });
        console.log("Fetched notes:", data);
        setNotes(data.notes || []);
        setHasMore(data.hasMore || false);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [debouncedSearch, sortBy, page]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">📚 Browse Notes</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore, discover, and learn from a variety of useful notes. Upload
          your knowledge and help others learn!
        </p>
      </motion.div>

      {/* Search and Sort Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
        {/* ✅ Search Input */}
        <Input
          placeholder="🔍 Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm border border-gray-300"
        />
        {/* ✅ Sort Options */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] border border-gray-300">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">📅 Most Recent</SelectItem>
            <SelectItem value="popular">🔥 Most Popular</SelectItem>
            <SelectItem value="oldest">📜 Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes Grid */}
      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          // Skeleton Loading Effect
          
          Array.from({ length: 1 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-lg aspect-[4/3]"
            />
          ))
        ) : notes.length > 0 ? (
          <NoteList notes={notes} />
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">😔 No notes found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && notes.length > 0 && (
        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ⏮️ Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
          >
            ⏭️ Next
          </Button>
        </div>
      )}
    </div>
  );
}
