"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, BookOpen, Users, Lock, Upload } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Upload className="w-6 h-6" />,
    text: "Upload & Share Notes",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    text: "Download Handwritten PDFs",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    text: "Secure File Management",
  },
  {
    icon: <Users className="w-6 h-6" />,
    text: "Collaborate with Peers",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    text: "Real-time Updates",
  },
];

const MarqueeText = () => {
  return (
    <div className="relative flex overflow-x-hidden bg-gradient-to-r from-background via-primary/10 to-background">
      <div className="animate-marquee whitespace-nowrap py-4">
        {features.map((feature, index) => (
          <span
            key={index}
            className="mx-4 inline-flex items-center gap-2 text-muted-foreground"
          >
            {feature.icon}
            {feature.text}
          </span>
        ))}
      </div>
    </div>
  );
};

const FloatingCard = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="absolute"
    >
      <Card className="p-4 bg-background/80 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary" />
        </div>
      </Card>
    </motion.div>
  );
};

const AnimatedHeading = () => {
  const words = ["Share", "Collaborate", "and", "Learn", "Seamlessly!"];

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-6xl font-bold mb-6"
      >
        <div className="flex flex-wrap justify-center gap-2">
          {words.map((word, index) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="relative inline-block"
            >
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                {word}
              </span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.2,
                }}
              />
            </motion.span>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-2xl"
      />
    </div>
  );
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Cards */}
      <FloatingCard delay={0} />
      <FloatingCard delay={0.2} />
      <FloatingCard delay={0.4} />

      <div className="container relative px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Marquee Text */}
          <div className="mb-8">
            <MarqueeText />
          </div>

          {/* Main Heading */}
          <AnimatedHeading />

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Join our community of learners and educators. Share your knowledge,
            discover new perspectives, and grow together.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/create">
              <Button size="lg" className="w-full sm:w-auto relative group">
                <span className="relative z-10">Get Started</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                />
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto relative group"
              >
                <span className="relative z-10">Explore Notes</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                />
              </Button>
            </Link>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group"
              >
                <motion.div
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.text}
                </h3>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
