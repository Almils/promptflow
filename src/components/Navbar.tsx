"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const dropdownRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLUListElement>(null);

  const isActive = (path: string) =>
    pathname === path ? "text-yellow-300 font-bold" : "hover:text-indigo-300";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    // Use capture phase to avoid interference with button clicks
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between shadow-md relative">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-wide hover:text-indigo-300">
        <Image
          src="/myicon.png"
          alt="PromptFlow Logo"
          width={32}
          height={32}
          className="rounded-full"
        />
        PromptFlow
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-8 font-semibold items-center">
        <li><Link href="/learn" className={isActive("/learn")}>Learn</Link></li>
        <li><Link href="/playground" className={isActive("/playground")}>Playground</Link></li>
        <li><Link href="/community" className={isActive("/community")}>Community</Link></li>
        <li><Link href="/leaderboard" className={isActive("/leaderboard")}>Leaderboard</Link></li>

        {!session ? (
          <li>
            <Link href="/auth" className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-bold hover:bg-indigo-50">
              Get Started
            </Link>
          </li>
        ) : (
          <li ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <Image
                src={session.user?.image || "/default-avatar.svg"}
                alt={session.user?.name || "User Avatar"}
                width={32}
                height={32}
                className="rounded-full border-2 border-white"
              />
              <span>{session.user?.name?.split(" ")[0] || "User"}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-40 bg-white text-indigo-700 rounded-lg shadow-lg py-2 z-50">
                <li><Link href="/dashboard" className="block px-4 py-2 hover:bg-indigo-50">Dashboard</Link></li>
                <li><Link href="/profile" className="block px-4 py-2 hover:bg-indigo-50">Profile</Link></li>
                <li><Link href="/settings" className="block px-4 py-2 hover:bg-indigo-50">Settings</Link></li>
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-50"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        )}
      </ul>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden focus:outline-none focus:ring-2 focus:ring-white rounded z-50"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul
          ref={mobileMenuRef}
          className="absolute top-full left-0 right-0 bg-indigo-700 flex flex-col items-center space-y-4 py-4 md:hidden z-40"
        >
          <li><Link href="/learn" className={isActive("/learn")} onClick={() => setMenuOpen(false)}>Learn</Link></li>
          <li><Link href="/playground" className={isActive("/playground")} onClick={() => setMenuOpen(false)}>Playground</Link></li>
          <li><Link href="/community" className={isActive("/community")} onClick={() => setMenuOpen(false)}>Community</Link></li>
          <li><Link href="/leaderboard" className={isActive("/leaderboard")} onClick={() => setMenuOpen(false)}>Leaderboard</Link></li>

          {!session ? (
            <li>
              <Link
                href="/auth"
                className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-bold hover:bg-indigo-50"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </li>
          ) : (
            <>
              <li><Link href="/dashboard" className="block px-4 py-2 hover:bg-indigo-50" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
              <li><Link href="/profile" className="block px-4 py-2 hover:bg-indigo-50" onClick={() => setMenuOpen(false)}>Profile</Link></li>
              <li><Link href="/settings" className="block px-4 py-2 hover:bg-indigo-50" onClick={() => setMenuOpen(false)}>Settings</Link></li>
              <li>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}
