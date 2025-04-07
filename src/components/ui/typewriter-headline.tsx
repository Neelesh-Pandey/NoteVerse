"use client";

import { motion } from "framer-motion";

interface TypewriterHeadlineProps {
  text: string;
}

export function TypewriterHeadline({ text }: TypewriterHeadlineProps) {
  return (
    <div className="relative py-4 md:py-6">
      <h1 className="max-w-4xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl [&_span]:inline-block [&_span]:leading-[1.2] [&_span]:pb-2">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.03,
              type: "spring",
              stiffness: 200,
            }}
            className="relative inline-block bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-400 bg-clip-text text-transparent dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300"
            style={{
              padding: "0.1em 0", // Add padding to prevent descender clipping
              marginRight: char === " " ? "0.25em" : "0", // Add space between words
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </h1>
    </div>
  );
}
