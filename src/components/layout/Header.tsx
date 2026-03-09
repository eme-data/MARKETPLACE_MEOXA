"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-meoxa-blue sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-meoxa.svg"
              alt="MEOXA"
              width={40}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-white font-bold text-lg tracking-tight">
              MEOXA
            </span>
            <span className="text-white/60 text-sm font-light hidden sm:inline">
              Marketplace
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/catalogue"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Catalogue
            </Link>
            <Link
              href="/pricing"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Tarifs
            </Link>
            <Link
              href="/blog"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Blog
            </Link>

            {session ? (
              <div className="flex items-center gap-4">
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-meoxa-orange hover:text-meoxa-orange-hover transition-colors text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  Mon espace
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-white/60 hover:text-white transition-colors text-sm"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="bg-meoxa-orange hover:bg-meoxa-orange-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/catalogue"
              className="block text-white/80 hover:text-white py-2 text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Catalogue
            </Link>
            <Link
              href="/pricing"
              className="block text-white/80 hover:text-white py-2 text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Tarifs
            </Link>
            <Link
              href="/blog"
              className="block text-white/80 hover:text-white py-2 text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-white/80 hover:text-white py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Mon espace
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="block text-white/60 hover:text-white py-2 text-sm"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-white/80 hover:text-white py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="block bg-meoxa-orange text-white px-4 py-2 rounded-lg text-sm text-center mt-2"
                  onClick={() => setMobileOpen(false)}
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
