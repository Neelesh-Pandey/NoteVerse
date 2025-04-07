"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBigUp, ArrowBigUpDash } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpvoteButtonProps {
  isUpvoted: boolean;
  upvoteCount: number;
  onUpvote: () => void;
  className?: string;
}

export function UpvoteButton({
  isUpvoted,
  upvoteCount,
  onUpvote,
  className,
}: UpvoteButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={onUpvote}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          "group relative flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
          "dark:bg-zinc-900/50 dark:hover:bg-zinc-800/50",
          "bg-gray-200/50 hover:bg-gray-300/50",
          isUpvoted
            ? "dark:text-zinc-200 dark:hover:text-zinc-100 text-gray-800 hover:text-gray-900"
            : "dark:text-zinc-400 dark:hover:text-zinc-300 text-gray-600 hover:text-gray-700",
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{
            rotate: isUpvoted ? 0 : isHovered ? -10 : 0,
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {isUpvoted ? (
            <ArrowBigUp className="h-4 w-4" />
          ) : (
            <ArrowBigUpDash className="h-4 w-4" />
          )}
        </motion.div>
        <span>{upvoteCount}</span>
      </motion.button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute -right-2 top-full mt-2 rounded-md px-2 py-1 text-xs shadow-lg
            dark:bg-zinc-800 dark:text-zinc-200 bg-gray-100 text-gray-800"
          >
            {isUpvoted ? "Click to Unvote" : "Click to Upvote"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
