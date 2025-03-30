"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function EditNoteModal({ note, onUpdate, onClose }) {
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [imageUrl, setImageUrl] = useState(note.imageUrl);
  const [pdfUrl, setPdfUrl] = useState(note.pdfUrl);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/upload/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, imageUrl, pdfUrl }),
      });
      if (!res.ok) throw new Error("Failed to update note");

      onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" />
        <Input value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="PDF URL" />
        <DialogFooter>
          <Button onClick={handleUpdate} disabled={loading}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
