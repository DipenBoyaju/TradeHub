"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Grid, User, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { HeaderSearch } from "./HeaderSearch";

interface HeaderProps {
  isAuthenticated: boolean;
  user?: {
    name?: string;
    image?: string;
  };
}

export function Header({ isAuthenticated, user }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide search bar on Homepage
  const isHomePage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:inline-block">
              Nepa<span className="text-emerald-600">Hub</span>
            </span>
          </Link>
        </div>

        {/* MIDDLE: Search Bar (Hidden on Home Page) */}
        <div className="hidden md:flex flex-1 items-center justify-center px-8">
          {!isHomePage && <HeaderSearch />}
        </div>

        {/* RIGHT: Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/categories"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Grid className="h-4 w-4 text-slate-400" />
            Categories
          </Link>

          <Link
            href="/watchlist"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Bookmark className="h-4 w-4 text-slate-400" />
            Watchlist
          </Link>

          <span className="h-4 w-px bg-slate-200 my-auto mx-1" aria-hidden="true" />

          {isAuthenticated ? (
            <Link
              href="/my-trade-hub"
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors"
            >
              <User className="h-3.5 w-3.5" />
              <span>{user?.name || "Account"}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-primary-hover transition-all"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Search Bar (Below main header bar on non-home pages) */}
      {!isHomePage && (
        <div className="border-t border-slate-100 px-4 py-2 md:hidden bg-slate-50/50">
          <HeaderSearch />
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 md:hidden">
          <Link
            href="/categories"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 rounded-lg p-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Grid className="h-4 w-4 text-slate-400" />
            Categories
          </Link>

          <Link
            href="/my-trade-hub"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 rounded-lg p-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Bookmark className="h-4 w-4 text-slate-400" />
            Watchlist
          </Link>

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <Link
                href="/my-trade-hub"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-xl bg-slate-100 p-2.5 text-sm font-bold text-slate-800"
              >
                <User className="h-4 w-4" />
                Dashboard ({user?.name || "User"})
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary p-2.5 text-sm font-semibold text-white"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}