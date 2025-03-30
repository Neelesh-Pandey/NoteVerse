"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Upload, Download, Lock, Users, FileText, BarChart } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

const features = [
  {
    icon: <Upload className="h-6 w-6 text-primary dark:text-primary" />,
    title: "Upload & Share Notes",
    description: "Easily upload your handwritten notes and share them with your peers.",
  },
  {
    icon: <Download className="h-6 w-6 text-primary dark:text-primary" />,
    title: "Download Handwritten PDFs",
    description: "Access and download high-quality PDFs of handwritten notes anytime.",
  },
  {
    icon: <Lock className="h-6 w-6 text-primary dark:text-primary" />,
    title: "Secure File Management",
    description: "Your notes are securely stored and protected with advanced encryption.",
  },
  {
    icon: <Users className="h-6 w-6 text-primary dark:text-primary" />,
    title: "Collaborate with Peers",
    description: "Work together with classmates and share knowledge seamlessly.",
  },
  {
    icon: <FileText className="h-6 w-6 text-primary dark:text-primary" />,
    title: "Real-time Updates",
    description: "Get instant notifications when new notes are shared in your subjects.",
  },
  {
    icon: <BarChart className="h-6 w-6 text-primary dark:text-primary" />,
    title: "Track Contributions",
    description: "Monitor your contributions and see how your notes help others.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function FeaturesSection() {
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
            Platform Features
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Discover how our platform makes note-sharing and learning more efficient and enjoyable.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item} className="min-h-[14rem] list-none">
              <FeatureItem icon={feature.icon} title={feature.title} description={feature.description} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

interface FeatureItemProps {
  icon: React.ReactNode
  title: string
  description: React.ReactNode
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
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
          <div className="w-fit rounded-lg border border-primary/20 p-2 bg-primary/10">{icon}</div>
          <div className="space-y-3">
            <h3 className="pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] text-balance text-black dark:text-white">
              {title}
            </h3>
            <p className="font-sans text-sm/[1.125rem] md:text-base/[1.375rem] text-slate-600 dark:text-slate-300">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

