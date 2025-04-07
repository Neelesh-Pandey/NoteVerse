"use client";

import { useEffect, useState } from "react";
import {  useParams } from "next/navigation";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Comment from "@/components/Comment";
import { useAuth } from "@clerk/nextjs";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "framer-motion";
import { UpvoteButton } from "@/components/ui/upvote-button";
import { toast } from "@/components/ui/use-toast";


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
  const [isBookmarked, setIsBookmarked] = useState(false);

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
          if(!user) {
            toast({
              title: "Error",
              description: "User not found.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, clerkUserId]);

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

  // Handle Upvote
  const handleUpvote = async () => {
    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to upvote notes.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(`/api/upvote`, {
        noteId: note?.id,
      }
      );
      setNote((prev) =>
        prev
          ? {
              ...prev,
              isUpvoted: !prev.isUpvoted,
              upvotes: prev.isUpvoted
                ? (prev.upvotes || 0) - 1
                : (prev.upvotes || 0) + 1,
            }
          : null
      );
    } catch (error) {
      console.error("Error upvoting:", error);
      toast({
        title: "Error",
        description: "Failed to upvote. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle Bookmark
  const handleBookmark = async () => {
    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to bookmark notes.",
        variant: "destructive",
      });
      return;
    }
    try{
      if(isBookmarked) {
        await axios.delete(`/api/bookmark`, {
          data: {
            noteId: note?.id,
          },

      });
        setIsBookmarked(false);
      }
      else {
        await axios.post(`/api/bookmark`, {
          noteId: note?.id,
        });
        setIsBookmarked(true);
      }

      toast({
        description: isBookmarked
          ? "Note removed from bookmarks"
          : "Note added to bookmarks",
      });
    } catch (error) {
      console.error("Error bookmarking:", error);
      toast({
        title: "Error",
        description: "Failed to bookmark. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if note is bookmarked on load
  useEffect(() => {
    if (currentUser && note) {
      axios
        .get(`/api/bookmark`, {
          params: {
            noteId: note.id,
          },
        })
        .then((response) => setIsBookmarked(response.data.isBookmarked))
        .catch((error) =>
          console.error("Error checking bookmark status:", error)
        );
    }
  }, [currentUser, note]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
      </div>
    );

  if (!note)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          Note not found
        </p>
      </div>
    );

  return (
    <>
     
      <CustomCursor />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6 space-y-8"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-800">
              {note.user.imageUrl ? (
                <AvatarImage
                  src={note.user.imageUrl}
                  alt="User Avatar"
                  className="object-cover w-full h-full"
                />
              ) : (
                <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                  {(note.user.name?.[0] || "U").toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {note.user.name || "Unknown User"}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UpvoteButton
              isUpvoted={note.isUpvoted || false}
              upvoteCount={note.upvotes || 0}
              onUpvote={handleUpvote}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
              className="gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(note.pdfUrl, "_blank")}
              className="gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <ExternalLink className="w-4 h-4" />
              View Full
            </Button>
          </div>
        </div>

        {/* Note Content */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {note.title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {note.description}
          </p>
        </div>

        {/* PDF Preview */}
        <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
          <iframe
            src={note.pdfUrl}
            className="w-full h-[600px] bg-white dark:bg-zinc-900"
          />
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Comments
          </h2>

          {/* New Comment Form */}
          <div className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:border-transparent"
              placeholder="Add a comment..."
              rows={3}
            />
            <div className="flex items-center justify-between">
              <Button
                onClick={handleCommentSubmit}
                disabled={!currentUser}
                className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
              >
                {currentUser ? "Post Comment" : "Sign in to Comment"}
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                />
              ))
            ) : (
              <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
