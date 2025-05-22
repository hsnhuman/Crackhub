import authConfig from "./app/auth/auth.config";
import NextAuth from "next-auth";
import { publicRoutes } from "./route"; // Import your list of public routes

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const isLoggedin = !!req.auth;
  const { nextUrl } = req;
  const url = "http://localhost:3000";
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = nextUrl.pathname.includes("/auth");
  const isApiRoute = nextUrl.pathname.includes("/api");
  const isdbroute = nextUrl.pathname.includes(
    `ep-shrill-glitter-abj9d29b-pooler.eu-west-2.aws.neon.tech:5432`
  );

  if (isApiRoute) {
    return; // Allow API routes
  }
  if (isdbroute) {
    return; // Allow API routes
  }

  if (isPublicRoute) {
    return; // Allow access to public routes
  }

  if (isAuthRoute && !isLoggedin) {
    return; // Allow access to auth routes if not logged in
  }

  if (!isLoggedin) {
    return Response.redirect(`${url}/auth/login`); // Redirect to login for all other non-public, non-auth routes
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
