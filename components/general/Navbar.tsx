"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [inviteCount, setInviteCount] = useState(0);

  // Function to fetch latest invite count
  async function fetchInvites() {
    const response = await fetch("/api/inviteCount");
    const data = await response.json();
    setInviteCount(data.count);
  }

  // Fetch count on mount and when the session updates
  useEffect(() => {
    if (session) fetchInvites();
  }, [session]);

  return (
    <nav className="fixed top-0 left-0 h-full w-42 bg-gray-100 shadow-md p-4 flex flex-col justify-between">
      <div>
        <Link href="/">
          <h1 className="text-3xl font-semibold mb-8 cursor-pointer">
            Crack<span className="text-blue-500">Hub</span>
          </h1>
        </Link>
        <div className="flex flex-col space-y-4">
          <Link
            className="text-sm font-medium hover:text-blue-400 transition-colors"
            href="/"
          >
            Home
          </Link>
          <Link
            className="text-sm font-medium hover:text-blue-400 transition-colors"
            href="/games"
          >
            Games
          </Link>
          <Link
            className="text-sm font-medium hover:text-blue-400 transition-colors"
            href="/dashboard"
          >
            Dashboard
          </Link>

          {session ? (
            <div className="flex flex-col space-y-2 mt-1">
              <Link href="/profile">my events</Link>
              <Link href="/invite" onClick={() => setInviteCount(0)}>
                my invites{" "}
                {inviteCount > 0 && (
                  <span className="ml-2 text-red-500">({inviteCount})</span>
                )}
              </Link>

              <Link href="/setting">profile</Link>
              <button onClick={signOut}>{session.user?.name}, sign out</button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 mt-8"></div>
          )}
        </div>
      </div>
    </nav>
  );
}
