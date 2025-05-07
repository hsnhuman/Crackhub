import { prisma } from "../utils/db";

import Events from "@/components/general/Events";

async function getData() {
  "use server";
  const data = await prisma.blogpost.findMany();
  return data;
}
export default async function DashboardRoute() {
  const blogPosts = await getData(); // fetch data here
  return <Events blogPosts={blogPosts} />; // pass the data directly
}
