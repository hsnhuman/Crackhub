import Link from "next/link";
import { prisma } from "./utils/db";
import { BlogpostCard } from "@/components/general/BlogpostCard";

async function getData() {
  const data = await prisma.blogpost.findMany({
    select: {
      title: true,
      content: true,
      game: true,
      authorName: true,
      id: true,
      createdat: true,
      authorid: true,
      updatedat: true,
      scheduled: true,
    },
  });
  return data;
}
export default async function Home() {
  const data = await getData();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 px-4">
      <div className="max-w-2xl bg-white bg-opacity-80 backdrop-blur-lg p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          crackhub
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">
          Building beautiful, responsive, and functional web experiences with
          Next.js and Tailwind CSS.
        </p>
        <a
          href="#get-started"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
