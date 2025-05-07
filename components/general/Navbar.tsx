import { buttonVariants } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import Link from "next/link";

export async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    // Change the outer container to a sidebar layout
    <nav className="fixed top-0 left-0 h-full w-50 bg-gray-100 shadow-md p-4 flex flex-col justify-between">
      {/* Logo and navigation links */}
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

          {user ? (
            <div className="flex flex-col space-y-2 mt-1">
              <Link href="/profile" className="flex items-center gap-2">
                {user.given_name}
              </Link>
              <LogoutLink className={buttonVariants({ variant: "secondary" })}>
                Logout
              </LogoutLink>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 mt-8">
              <RegisterLink
                className={buttonVariants({ variant: "secondary" })}
              >
                Sign up
              </RegisterLink>
              <LoginLink className={buttonVariants({ variant: "secondary" })}>
                Login
              </LoginLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
