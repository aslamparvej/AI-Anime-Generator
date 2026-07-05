// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const user = session?.user;

  return (
    <header className="backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2">
          <h3 className="website-title">AI Anime Storyboard Maker</h3>
        </Link>

        {/* Middle: Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link
            href="/dashboard"
            className="text-text-light hover:text-text-white transition"
          >
            Dashboard
          </Link>
          <Link
            href="/storyboard/new"
            className="text-text-light hover:text-text-white transition"
          >
            New Storyboard
          </Link>
        </nav>

        {/* Right: Auth actions */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-8 w-24 rounded-full bg-border animate-pulse" />
          ) : user ? (
            <>
              {/* User pill */}
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-card border border-border border-[var(--border-color)] px-3 py-1.5">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                    {user.name?.[0]?.toUpperCase() ||
                      user.email?.[0]?.toUpperCase() ||
                      "U"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-white leading-tight">
                    {user.name || user.email}
                  </span>
                  <span className="text-[11px] text-text-light leading-tight">
                    Signed in
                  </span>
                </div>
              </div>

              {/* Sign out button */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs sm:text-sm rounded-full px-3 py-1.5 font-medium text-text-white bg-border hover:bg-border/80 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
                className="hidden sm:inline-flex text-xs sm:text-sm rounded-full px-3 py-1.5 font-medium text-text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition"
              >
                Sign in
              </button>
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="inline-flex sm:hidden text-xs rounded-full px-3 py-1.5 font-medium text-text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
