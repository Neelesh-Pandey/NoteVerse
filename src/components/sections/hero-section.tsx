"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Users,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// Typewriter phrases
const PHRASES = [
  "Upload Notes...",
  "Download PDFs...",
  "Collaborate with Peers...",
  "Learn & Grow...",
];

// Marquee items
const MARQUEE_ITEMS = [
  { icon: "📚", text: "Upload Notes" },
  { icon: "📥", text: "Download PDFs" },
  { icon: "🔐", text: "Secure File Management" },
  { icon: "🤝", text: "Collaborate with Peers" },
  { icon: "📄", text: "Real-time Updates" },
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Animated background elements */}
      <BackgroundElements />

      {/* Main content */}
      <div className="container relative z-10 mx-auto flex  flex-col items-center justify-center px-4 py-20 text-center">
        {/* Main heading with animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <TypewriterHeadline text="Collaborate, Learn, and Excel Together!" />
        </motion.div>

        {/* Subheading */}
        <motion.p
          className="mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Share, Collaborate, and Download Handwritten Notes Easily.
        </motion.p>

        {/* Typewriter effect */}
        <motion.div
          className="mb-10 h-12 text-xl font-medium text-slate-800 sm:text-2xl dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <TypewriterEffect />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="mb-16 flex flex-row space-x-4 space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link href="/create">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 dark:from-blue-500 dark:to-indigo-500"
            >
              Upload Notes
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/browse">
            <Button
              variant="outline"
              size="lg"
              className="border-slate-300 px-8 text-slate-800 transition-all hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
            >
              Explore Notes
            </Button>
          </Link>
        </motion.div>

        {/* Marquee effect */}
        <motion.div
          className="w-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <MarqueeEffect />
        </motion.div>
      </div>
    </div>
  );
}

// Typewriter effect component
function TypewriterEffect() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter logic
  useEffect(() => {
    const currentPhrase = PHRASES[currentIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (currentText.length < currentPhrase.length) {
            setCurrentText(currentPhrase.substring(0, currentText.length + 1));
          } else {
            // Pause at the end before deleting
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          // Deleting
          if (currentText.length > 0) {
            setCurrentText(currentText.substring(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((currentIndex + 1) % PHRASES.length);
          }
        }
      },
      isDeleting ? 50 : 100
    ); // Faster when deleting

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting]);

  return (
    <div className="inline-flex items-center">
      <span>{currentText}</span>
      <span
        className={`ml-1 inline-block h-6 w-0.5 bg-blue-600 dark:bg-blue-400 ${
          showCursor ? "opacity-100" : "opacity-0"
        }`}
      ></span>
    </div>
  );
}

// Marquee effect component
function MarqueeEffect() {
  return (
    <div className="relative flex w-full overflow-x-hidden bg-slate-100/50 py-4 backdrop-blur-sm dark:bg-slate-800/30">
      <div className="animate-marquee flex whitespace-nowrap">
        {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, index) => (
          <div
            key={index}
            className="mx-8 flex items-center text-slate-700 dark:text-slate-300"
          >
            <span className="mr-2 text-xl">{item.icon}</span>
            <span className="font-medium">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Animated background elements
function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Floating elements */}
      {[...Array(15)].map((_, i) => {
        const icons = [
          <FileText
            key={`file-${i}`}
            className="h-full w-full text-blue-500/10 dark:text-blue-400/10"
          />,
          <Download
            key={`download-${i}`}
            className="h-full w-full text-indigo-500/10 dark:text-indigo-400/10"
          />,
          <Users
            key={`users-${i}`}
            className="h-full w-full text-purple-500/10 dark:text-purple-400/10"
          />,
          <BookOpen
            key={`book-${i}`}
            className="h-full w-full text-sky-500/10 dark:text-sky-400/10"
          />,
        ];

        const size = 20 + Math.random() * 60;
        const duration = 15 + Math.random() * 30;
        const delay = Math.random() * -30;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              height: size,
              width: size,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() > 0.5 ? 15 : -15, 0],
              rotate: [0, Math.random() > 0.5 ? 10 : -10, 0],
            }}
            transition={{
              duration,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "easeInOut",
            }}
          >
            {icons[i % icons.length]}
          </motion.div>
        );
      })}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 dark:to-black" />
    </div>
  );
}

function TypewriterHeadline({ text }: { text: string }) {
  return (
    <h1 className="mb-4 max-w-4xl text-4xl font-extrabold leading-none tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance text-slate-900 dark:text-white">
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
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </h1>
  );
}
