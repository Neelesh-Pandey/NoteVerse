"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

// Interface for Bookmark object
interface Bookmark {
  note: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    pdfUrl: string;
    createdAt: string;
  };
}

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // ✅ Fetch all bookmarks
  const fetchBookmarks = async () => {
    try {
      const res = await axios.get("/api/bookmark");
      setBookmarks(res.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Bookmarked Notes</h1>
      {bookmarks.length === 0 ? (
        <p>No bookmarks found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.note.id}
              className="border p-4 rounded-md shadow-sm"
            >
              <h2 className="text-lg font-semibold">{bookmark.note.title}</h2>
              <p className="text-sm text-gray-600">{bookmark.note.description}</p>
              <Link
                href={`/browse/${bookmark.note.id}`}
                className="text-blue-500 mt-2 block"
              >
                View Note
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkPage;
