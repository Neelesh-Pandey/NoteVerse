import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import axios from "axios";
import { UpvoteButton } from "@/components/ui/upvote-button";

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
  upvotes?: number;
  isUpvoted?: boolean;
}

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export const NoteCard = ({ note, onClick }: NoteCardProps) => {
  const [isUpvoted, setIsUpvoted] = useState<boolean>(note.isUpvoted || false);
  const [upvoteCount, setUpvoteCount] = useState<number>(note.upvotes || 0);

  // Handle upvote logic
  const handleUpvote = async () => {
    try {
      const res = await axios.post("/api/upvote", {
        noteId: note.id,
      });

      if (res.status === 200) {
        // Refetch updated note after upvote/unvote
        const { data: updatedNote } = await axios.get(`/api/upload/${note.id}`);

        // Set up-to-date values
        setIsUpvoted(updatedNote.isUpvoted);
        setUpvoteCount(updatedNote.upvotes);
      }
    } catch (error) {
      console.error("Error toggling upvote:", error);
    }
  };

  return (
    <div

      className=" border p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-200
      bg-white dark:bg-black w-full max-w-sm flex flex-col justify-between"
    >
      {/* User Info */}
      <div className="flex justify-between">
      <div className="flex items-center gap-3">
        {note.user.imageUrl ? (
          <Avatar className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
            <AvatarImage
              src={note.user.imageUrl}
              alt="User Avatar"
              className="object-cover w-full h-full"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
        )}
        <div className="flex-1">
          <p className="font-semibold text-sm truncate max-w-[150px]">
            {note.user.name || "Unknown User"}
          </p>
        </div>
      </div>
      <UpvoteButton
          isUpvoted={isUpvoted}
          upvoteCount={upvoteCount}
          onUpvote={handleUpvote}
        />
      </div>

      {/* Note Preview */}
      <div className="mt-3 flex-1 ">
        <h2 className="text-lg font-semibold truncate max-w-[100%] line-clamp-1">
          {note.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{note.description}</p>
      </div>

      {/* Image Preview */}
      {note.imageUrl && (
        <div className="w-full h-32 overflow-hidden rounded-md mt-3">
          <Image
            src={note.imageUrl}
            alt={note.title}
            className="object-cover w-full h-full"
            width={100}
            height={100}
            unoptimized
          />
        </div>
      )}


      {/* Open Button */}
      <div className="mt-4">
        <Button variant={"outline"} className="w-full text-sm" onClick={onClick}>
          Open
        </Button>
      </div>
    </div>
  );
};
