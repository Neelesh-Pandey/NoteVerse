// src/_components/NoteList.tsx
"use client";

import { useRouter } from "next/navigation";
import { NoteCard } from "./NoteCard";

interface Note {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
  user: {
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
}

interface NoteListProps {
  notes: Note[];
}

export const NoteList = ({ notes }: NoteListProps) => {
  const router = useRouter();

  return (
    <div>
      {/* Grid Layout for Notes */}
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => router.push(`/browse/${note.id}`)}
          />
        ))}
      </div>

      {/* No Notes Found */}
      {notes.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          😔 No notes found.
        </div>
      )}
    </div>
  );
};
