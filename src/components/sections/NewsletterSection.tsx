"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400">
            Stay Updated
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Subscribe to our newsletter for the latest updates and study resources.
          </p>
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 border text-sm placeholder:text-opacity-70 focus:ring bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700 dark:focus:ring-zinc-700"
            />
            <Button className="transition-colors bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-200 dark:text-black dark:hover:bg-zinc-300">
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
