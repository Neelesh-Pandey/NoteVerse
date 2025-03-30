"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Computer Science Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content:
      "This platform has revolutionized how I share and access study materials. The quality of notes is exceptional!",
  },
  {
    name: "Michael Chen",
    role: "Engineering Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    content:
      "The collaboration features are amazing. I've found study groups and shared resources that helped me excel in my courses.",
  },
  {
    name: "Emma Davis",
    role: "Mathematics Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    content:
      "The real-time updates and notifications keep me informed about new study materials. It's been a game-changer!",
  },
  {
    name: "James Wilson",
    role: "Physics Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    content:
      "The platform's interface is intuitive, and the note quality is consistently high. Highly recommended!",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface TestimonialItemProps {
  testimonial: {
    name: string;
    role: string;
    image: string;
    content: string;
  };
}

const TestimonialItem = ({ testimonial }: TestimonialItemProps) => {
  return (
    <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
      <GlowingEffect
        blur={0}
        borderWidth={2}
        spread={80}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6 bg-white dark:bg-slate-800 dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
        <div className="relative flex flex-1 flex-col justify-between gap-3">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>
          <p className="font-sans text-sm/[1.125rem] md:text-base/[1.375rem] text-slate-600 dark:text-slate-300">
            &ldquo;{testimonial.content}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={testimonial.image} alt={testimonial.name} />
              <AvatarFallback>
                {testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-black dark:text-white">
                {testimonial.name}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {testimonial.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
            What Our Users Say
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Join thousands of students who have transformed their learning
            experience with our platform.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={item}
              className="min-h-[14rem] list-none"
            >
              <TestimonialItem testimonial={testimonial} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
