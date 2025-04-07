"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  title?: string;
  description: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function Toast({
  title,
  description,
  variant = "default",
  duration = 3000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 shadow-lg ${
            variant === "destructive"
              ? "bg-red-500 text-white"
              : "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900"
          }`}
        >
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p className="text-sm">{description}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function toast(props: ToastProps) {
  return <Toast {...props} />;
}
