import { prisma } from "../utils/db";
import Events from "@/components/general/Events";

async function getData() {
  "use server";
  return await prisma.blogpost.findMany();
}

async function getGame() {
  "use server";
  return await prisma.games.findMany();
}

async function getPresence(blogPostIds: string[]) {
  "use server";
  return await prisma.inChatRoom.findMany({
    where: {
      chatRoom: {
        blogpostId: { in: blogPostIds },
      },
    },
    include: {
      chatRoom: {
        include: {
          blogpost: true,
        },
      },
    },
  });
}

export default async function DashboardRoute() {
  const blogPosts = await getData();
  const blogPostIds = blogPosts.map((post) => post.id);
  const games = await getGame();
  const presence = await getPresence(blogPostIds);

  return (
    <>
      <Events blogPosts={blogPosts} games={games} presence={presence} />
    </>
  );
}
