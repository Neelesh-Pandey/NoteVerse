"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">StudyShare</h3>
            <p className="text-sm">
              Empowering students to share knowledge and learn together.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-white">
                  Browse Notes
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-white">
                  Upload Notes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/twitter" className="hover:text-white">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="/github" className="hover:text-white">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="/discord" className="hover:text-white">
                  Discord
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} StudyShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
