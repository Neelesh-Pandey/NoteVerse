"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import DataTable, { Note } from "@/components/DataTable";

// ✅ Define API response schema
const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  pdfUrl: z.string().url(),
  createdAt: z.string(),
});

const notesSchema = z.array(noteSchema);

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState<string>("");

  // ✅ Fetch Notes
  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await axios.get("/api/upload/me");
        const validatedData = notesSchema.safeParse(res.data);

        if (!validatedData.success) {
          console.error("Invalid API response", validatedData.error);
          return;
        }

        setNotes(validatedData.data);
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

  return (
    <div className="max-w-4xl mx-auto p-6">
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
        data={notes.filter((note) => note.title.toLowerCase().includes(filter.toLowerCase()))}
        onDelete={handleDelete}
      />
    </div>
  );
}
