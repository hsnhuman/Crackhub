import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "../utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import BlogpostCard from "@/components/general/BlogpostCard";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { auth } from "../auth/auth";

async function getData() {
  const session = await auth();
  const user = session?.user;
  const data = await prisma.blogpost.findMany({
    where: {
      authorid: user?.id,
    },
    orderBy: {
      createdat: "desc",
    },
  });
  return data;
}

export default async function DashboardRoute() {
  const data = await getData();
  const blogPosts = await getData();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-8 relative font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-4">
        <h2 className="text-3xl font-semibold text-white shadow-lg">
          Your Events
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white text-xl font-medium">
              No events found. Start by creating one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((post) => (
              <div
                key={post.id}
                className="bg-white bg-opacity-80 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-4"
              >
                <h1 className="text-xl font-semibold mb-2 text-gray-800">
                  {post.title}
                </h1>
                <BlogpostCard post={post} key={post.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
