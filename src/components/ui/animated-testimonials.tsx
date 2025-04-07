"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
  interval = 4000,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  interval?: number;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const intervalId = setInterval(() => {
        setActive((prev) => (prev + 1) % testimonials.length);
      }, interval);
      return () => clearInterval(intervalId);
    }
  }, [autoplay, interval, testimonials.length]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-12 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.image}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -40, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-1 shadow-lg dark:from-slate-800 dark:to-slate-900">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-full rounded-xl object-cover object-center"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {testimonials[active].name}
              </h3>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {testimonials[active].role}
              </p>
            </div>
            <div className="relative">
              <motion.p className="relative pt-2 text-lg text-slate-700 dark:text-slate-300">
                {testimonials[active].quote.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </div>
          </motion.div>
          <div className="flex gap-4 pt-8 md:pt-0">
            <button
              onClick={handlePrev}
              className="group flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 transition-colors hover:bg-blue-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-blue-700 transition-transform duration-300 group-hover:-translate-x-0.5 dark:text-blue-400" />
            </button>
            <button
              onClick={handleNext}
              className="group flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 transition-colors hover:bg-blue-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-blue-700 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
