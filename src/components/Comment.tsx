"use client";

import { CommentType } from "@/app/(routes)/browse/[id]/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface CommentProps {
  comment: CommentType;
  onReply: (parentId: string, content: string) => void;
}

export default function Comment({ comment, onReply }: CommentProps) {
  const [reply, setReply] = useState<string>("");
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);

  async function handleReplySubmit() {
    if (reply.trim()) {
      await onReply(comment.id, reply);
      setReply("");
      setIsReplying(false);
    }
  }

  // Safely check for children
  const hasChildren = comment.children && comment.children.length > 0;

  // Get user display name with proper fallback
  const userName = comment.user?.name || "Anonymous";

  return (
    <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 mb-4">
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
          {comment.user?.imageUrl ? (
            <AvatarImage
              src={comment.user.imageUrl}
              alt={`${userName}'s Avatar`}
              className="object-cover w-full h-full"
            />
          ) : (
            <AvatarFallback className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {userName.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-semibold dark:text-gray-100">{userName}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {comment.content}
          </p>
        </div>
      </div>

      {/* Reply button */}
      <div className="ml-4 mb-2">
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="text-blue-500 dark:text-blue-400 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded"
        >
          {isReplying ? "Cancel" : "Reply"}
        </button>
      </div>

      {/* Reply Box */}
      {isReplying && (
        <div className="ml-4 mb-4">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none"
            placeholder="Reply..."
          />
          <button
            onClick={handleReplySubmit}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Submit Reply
          </button>
        </div>
      )}

      {/* Show See More Button if Nested Comments Exist */}
      {hasChildren && (
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="text-blue-500 dark:text-blue-400 text-sm mb-2 ml-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded"
        >
          {showReplies
            ? "Hide Replies"
            : `See ${comment.children.length} Replies`}
        </button>
      )}

      {/* Render Nested Comments */}
      {showReplies && hasChildren && (
        <div className="ml-8">
          {comment.children.map((child) => (
            <Comment key={child.id} comment={child} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}
