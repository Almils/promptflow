'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-indigo-700 text-white py-8 px-6 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} PromptFlow. All rights reserved.</p>

        <nav className="flex space-x-6 text-sm md:text-base" aria-label="Footer Navigation">
          <Link href="/about" aria-label="About PromptFlow" className="hover:text-indigo-300">
            About
          </Link>
          <Link href="/terms" aria-label="Terms of Service" className="hover:text-indigo-300">
            Terms
          </Link>
          <Link href="/privacy" aria-label="Privacy Policy" className="hover:text-indigo-300">
            Privacy
          </Link>
          <Link href="/contact" aria-label="Contact page" className="hover:text-indigo-300">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
