"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import DataTable, { Note } from "@/components/DataTable";
import { NavigationLink } from "@/components/navigation";

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState<string>("");

  // ✅ Fetch Notes
  useEffect(() => {
    
    async function fetchNotes() {
      try {
        // Get notes
        const res = await axios.get("/api/upload/me");
        
        // Ensure upvotes field exists (for backward compatibility)
        const notesWithUpvotes = res.data.map((note: Note) => ({
          ...note,
          upvotes: note.upvotes || 0
        }));
        
        setNotes(notesWithUpvotes);
      } catch (error) {
        console.error("Error fetching notes", error);
      }
    }

    fetchNotes();
  }, []);

  // ✅ Delete Note
  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/upload/${id}`);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note", error);
    }
  }

  // ✅ Handle Upvote
  async function handleUpvote(id: string) {
    try {
      // Optimistically update UI
      setNotes(prevNotes => 
        prevNotes.map(note => {
          if (note.id === id) {
            return {
              ...note,
              upvotes: (note.upvotes || 0) + 1,
              upvotedByUser: true
            };
          }
          return note;
        })
      );
      
      // Send API request
      await axios.post(`/api/upvote`, { noteId: id });
      
    } catch (error) {
      console.error("Error upvoting note", error);
      // Revert the optimistic update on error
      fetchNotes();
    }
  }

  // Helper function to refetch notes
  async function fetchNotes() {
    try {
      const res = await axios.get("/api/upload/me");
      setNotes(res.data);
    } catch (error) {
      console.error("Error refetching notes", error);
    }
  }

  return (
    
    
    <div className="max-w-4xl mx-auto p-6">
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
      <h1 className="text-2xl font-bold mb-4">My Uploaded Notes</h1>

      {/* 🔍 Search Input */}
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search notes..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Link href="/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Upload Note
          </Button>
        </Link>
      </div>

      {/* 📋 Data Table */}
      <DataTable
        data={notes
          .filter((note) => note.title.toLowerCase().includes(filter.toLowerCase()))
          .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))} // Sort by upvotes
        onDelete={handleDelete}
        onUpvote={handleUpvote}
      />
    </div>
  );
}