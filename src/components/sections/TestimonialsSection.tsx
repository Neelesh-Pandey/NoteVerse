import {
  AnimatedTestimonials,
  type Testimonial,
} from "@/components/ui/animated-testimonials";

export const testimonials: Testimonial[] = [
  {
    name: "Anjali Mehta",
    role: "B.Tech Student, CSE",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2459&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote:
      "This platform helped me score better in my internals! I found handwritten notes that explained tough topics way better than textbooks.",
  },
  {
    name: "Rahul Verma",
    role: "Assistant Professor, ECE",
    image:
      "https://images.unsplash.com/photo-1629747490241-624f07d70e1e?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote:
      "As a faculty member, I love that I can share my lecture notes easily with all students—even beyond my classroom. It's simple and effective!",
  },
  {
    name: "Sneha Kapoor",
    role: "MBA Student",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote:
      "I uploaded my old semester notes and made some extra money! It's a great way to help juniors while earning something on the side.",
  },
  {
    name: "Arjun Nair",
    role: "Final Year Engineering Student",
    image: "https://images.unsplash.com/photo-1572631382901-cf1a0a6087cb?q=80&w=3082&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote:
      "The PDF viewer is super clean and easy to use. I love that I can access notes on the go without downloading everything.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-white py-12 dark:bg-black md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            What Our Users Say
          </h2>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
            Join thousands of students and educators who are transforming how
            academic notes are shared and accessed.
          </p>
        </div>
        <AnimatedTestimonials testimonials={testimonials} />
      </div>
    </section>
  );
}
