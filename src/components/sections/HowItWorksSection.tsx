"use client";

import { motion } from "framer-motion";
import { CloudUpload, Search, Download, ThumbsUp } from "lucide-react";
import { JSX } from "react";

const steps = [
  {
    title: "Upload Your Notes",
    description: "Share your handwritten or digital notes with the community",
    icon: <CloudUpload className="h-10 w-10 text-blue-500 dark:text-blue-400" />, 
    color: "from-blue-600/20 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-500/5",
    glow: "group-hover:from-blue-400/40 group-hover:to-blue-500/30",
    textGradient: "from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600"
  },
  {
    title: "Search & Discover",
    description: "Find relevant notes from thousands of submissions",
    icon: <Search className="h-10 w-10 text-purple-500 dark:text-purple-400" />, 
    color: "from-purple-600/20 to-purple-600/5 dark:from-purple-500/20 dark:to-purple-500/5",
    glow: "group-hover:from-purple-400/40 group-hover:to-purple-500/30",
    textGradient: "from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600"
  },
  {
    title: "Download & Learn",
    description: "Download notes in various formats to enhance your learning",
    icon: <Download className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />, 
    color: "from-indigo-600/20 to-indigo-600/5 dark:from-indigo-500/20 dark:to-indigo-500/5",
    glow: "group-hover:from-indigo-400/40 group-hover:to-indigo-500/30",
    textGradient: "from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-600"
  },
  {
    title: "Give Feedback",
    description: "Rate and provide feedback to help others improve",
    icon: <ThumbsUp className="h-10 w-10 text-pink-500 dark:text-pink-400" />, 
    color: "from-pink-600/20 to-pink-600/5 dark:from-pink-500/20 dark:to-pink-500/5",
    glow: "group-hover:from-pink-400/40 group-hover:to-pink-500/30",
    textGradient: "from-pink-600 to-pink-800 dark:from-pink-400 dark:to-pink-600"
  },
];

interface StepProps {
  step: number;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  glow: string;
  textGradient: string;
}

function Step({ step, title, description, icon, color, glow, textGradient }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: step * 0.1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="h-full rounded-xl bg-white dark:bg-black p-8 shadow-lg transition-all duration-300 
        hover:shadow-xl shadow-gray-200/50 hover:shadow-gray-300/50 dark:shadow-zinc-900/30 dark:hover:shadow-zinc-800/40 
        border border-gray-100 dark:border-zinc-800">
        {/* Animated indicator line */}
        <div className="absolute top-8 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-purple-500 dark:from-blue-500 dark:to-purple-600 
          group-hover:w-full transition-all duration-700 ease-out"></div>
        
        {/* Icon */}
        <div className="mb-6 relative">
          <div className={`h-16 w-16 rounded-full bg-gradient-to-b ${color} flex items-center justify-center 
            ring-4 ring-white/70 dark:ring-black/20 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
            <div className="relative z-10">{icon}</div>
            
            {/* Hover glow effect */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${glow} opacity-0 
              group-hover:opacity-100 blur-sm transition-opacity duration-500`}></div>
          </div>
          
          {/* Step number */}
          <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white dark:bg-zinc-900 
            border-2 border-gray-200 dark:border-zinc-700 flex items-center justify-center 
            text-sm font-bold shadow-sm text-gray-800 dark:text-zinc-300">
            {step}
          </div>
        </div>

        {/* Title with gradient */}
        <h3 className={`mb-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${textGradient}`}>
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-zinc-400">{description}</p>
        
        {/* Animated underline on hover */}
        <div className="mt-6 w-12 h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-600 
          group-hover:from-blue-400 group-hover:to-purple-500 transition-colors duration-500"></div>
      </div>
    </motion.div>
  );
}

export function HowItWorksSection() {
  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-100 dark:bg-blue-900 blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-purple-100 dark:bg-purple-900 blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full bg-pink-100 dark:bg-pink-900 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-zinc-200 dark:to-zinc-400 sm:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-zinc-400">
            Get started with our platform in just a few simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {steps.map((step, index) => (
            <Step
              key={index}
              step={index + 1}
              title={step.title}
              description={step.description}
              icon={step.icon}
              color={step.color}
              glow={step.glow}
              textGradient={step.textGradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
}