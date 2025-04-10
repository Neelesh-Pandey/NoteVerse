"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-12 bg-white dark:bg-black border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-zinc-900 dark:text-zinc-200 font-bold mb-4">
              NoteVerse
            </h3>
            <p className="text-sm">
              Empowering students to share knowledge and learn together.
            </p>
          </div>
          <div>
            <h4 className="text-zinc-900 dark:text-zinc-200 font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/browse"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Browse Notes
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Upload Notes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-zinc-900 dark:text-zinc-200 font-semibold mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/aboutus"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacypolicy"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-zinc-900 dark:text-zinc-200 font-semibold mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.linkedin.com/in/neelesh-pandey-/"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Neelesh-Pandey"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/neelesh.pandey_/"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} NoteVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
