"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Comment from "@/components/Comment";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

// Comment Type
export interface CommentType {
  id: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  children: CommentType[];
  user: {
    id: string;
    name: string | null;
    imageUrl: string | null;
  };
}

// User Type
interface User {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
}

// Note Type
interface Note {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
  user: User;
  comments?: CommentType[];
  upvotes?: number;
  isUpvoted?: boolean;
}

export default function NotePage() {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const { userId: clerkUserId } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUpvoted, setIsUpvoted] = useState<boolean>(false);
  const [upvoteCount, setUpvoteCount] = useState<number>(0);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch note details
        const { data: noteData } = await axios.get(`/api/upload/${id}`);
        setNote(noteData);

        // Fetch comments separately to ensure we get the full tree
        const { data: commentsData } = await axios.get(
          `/api/comments?noteId=${id}`
        );
        setComments(commentsData);

        // Fetch current logged-in user
        if (clerkUserId) {
          const { data: user } = await axios.get(
            `/api/user-by-clerk/${clerkUserId}`
          );
          if (user) setCurrentUser(user);
        }
        setIsUpvoted(noteData.isUpvoted);
        setUpvoteCount(noteData.upvotes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, clerkUserId]);

  //upvote functction
  async function handleUpvote() {
    try {
      const res = await axios.post("/api/upvote", {
        noteId: note?.id,
      });

      if (res.status === 200) {
        // ✅ Refetch updated note after upvote/unvote
        const { data: updatedNote } = await axios.get(
          `/api/upload/${note?.id}`
        );

        // ✅ Set up-to-date values
        setIsUpvoted(updatedNote.isUpvoted);
        setUpvoteCount(updatedNote.upvotes);
      }
    } catch (error) {
      console.error("Error toggling upvote:", error);
    }
  }
  // Handle New Comment
  async function handleCommentSubmit() {
    if (!newComment.trim() || !currentUser) return;

    try {
      const res = await axios.post("/api/comments", {
        content: newComment,
        userId: currentUser.id,
        noteId: note?.id,
        parentId: null,
      });

      if (res.status === 200 || res.status === 201) {
        // Add new comment with proper user data
        const newCommentWithUser = {
          ...res.data,
          children: [],
          user: currentUser,
        };

        setComments([newCommentWithUser, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  }

  // Helper function to find and update a comment at any nesting level
  const updateCommentTree = (
    commentsList: CommentType[],
    parentId: string,
    newReply: CommentType
  ): CommentType[] => {
    return commentsList.map((comment) => {
      // If this is the parent comment, add the reply to its children
      if (comment.id === parentId) {
        return {
          ...comment,
          children: [...(comment.children || []), newReply],
        };
      }

      // If this comment has children, recursively search them
      if (comment.children && comment.children.length > 0) {
        return {
          ...comment,
          children: updateCommentTree(comment.children, parentId, newReply),
        };
      }

      // Not the right comment, return it unchanged
      return comment;
    });
  };

  // Handle Reply Comment (supports nested replies)
  async function handleReply(parentId: string, content: string) {
    if (!content.trim() || !currentUser) return;

    try {
      const res = await axios.post("/api/comments", {
        content,
        userId: currentUser.id,
        noteId: note?.id,
        parentId,
      });

      if (res.status === 200 || res.status === 201) {
        // Create a properly structured reply with user data
        const newReply = {
          ...res.data,
          children: [],
          user: currentUser,
        };

        // Update comments with the new reply at the correct nesting level
        const updatedComments = updateCommentTree(comments, parentId, newReply);
        setComments(updatedComments);
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  }

  if (loading) return <p>Loading note...</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
          {note.user.imageUrl ? (
            <AvatarImage
              src={note.user.imageUrl}
              alt="User Avatar"
              className="object-cover w-full h-full"
            />
          ) : (
            <AvatarFallback>
              {(note.user.name?.[0] || "U").toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-semibold">{note.user.name || "Unknown User"}</p>
        </div>
      </div>

      {/* Note Details */}
      <h1 className="text-2xl font-bold">{note.title}</h1>
      <p className="text-gray-600 dark:text-gray-300">{note.description}</p>

      {/* PDF Preview */}
      <div className="mt-4">
        <iframe src={note.pdfUrl} className="w-full h-96 border rounded-md" />
      </div>

      {/* Full Screen Button */}
      <div className="mt-4">
        <a
          href={note.pdfUrl}
          target="_blank"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          View Full Screen
        </a>
      </div>

      {/* Upvote Button */}
      <div className="mt-4 flex items-center gap-2">
        <Button
          onClick={handleUpvote}
          className={`px-4 py-2 rounded-md ${
            isUpvoted
              ? "bg-red-500 hover:bg-red-700"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white`}
        >
          {isUpvoted ? "👎 Unvote" : "👍 Upvote"} {upvoteCount}{" "}
          {/* ✅ Correct variable */}
        </Button>
      </div>
      {/* bookmark section */}

      {/* Comment Section */}
      <div className="mt-8 mb-8">
        <h2 className="text-xl font-bold mb-4">Comments</h2>

        {/* Add a new comment */}
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Add a comment..."
          />
          <button
            onClick={handleCommentSubmit}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            disabled={!currentUser}
          >
            Add Comment
          </button>
          {!currentUser && (
            <p className="text-red-500 mt-2">
              Please log in to leave a comment
            </p>
          )}
        </div>

        {/* Render comments */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onReply={handleReply}
              />
            ))
          ) : (
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
