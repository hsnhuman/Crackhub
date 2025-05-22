import { redirect } from "next/navigation";
import { prisma } from "../../utils/db";
import ChatRoom from "@/components/general/ChatRoom";
import { auth } from "@/app/auth/auth";

async function getPost(postId: string) {
  "use server";
  return prisma.blogpost.findUnique({ where: { id: postId } });
}

async function getData(postId: string) {
  "use server";

  let chatRoom = await prisma.chatRoom.findUnique({
    where: { blogpostId: postId },
    include: { messages: true },
  });

  if (!chatRoom) {
    chatRoom = await prisma.chatRoom.create({
      data: {
        name: `Chat Room for Blogpost ${postId}`,
        blogpostId: postId,
      },
      include: { messages: true },
    });
  }

  return chatRoom ?? { messages: [], name: "Default Room", id: "default-id" };
}

async function blocked(chatRoomId: string): Promise<boolean> {
  "use server";
  const session = await auth();
  const user = session?.user;

  if (!user) return false;

  console.log(`Checking block status for chatRoomId: ${chatRoomId}`);

  const block = await prisma.blocked.findFirst({
    where: { chatRoomId: chatRoomId, userId: user.id, isBlocked: true },
  });

  console.log(
    `Block status found: ${block ? "User is blocked" : "User is not blocked"}`
  );

  return !!block;
}
async function getusers() {
  "use server";
  const use = await prisma.user.findMany();
  return use;
}

export default async function Post({ params }: { params: { id: string } }) {
  const id = params.id;
  const user = await getusers();
  // First, get the chat room associated with the post
  const chatRoom = await getData(id);

  // Then, use the chat room ID in the blocked function
  const isBlocked = await blocked(chatRoom.id);

  if (isBlocked) {
    return redirect("/blocked"); // Immediately redirect blocked users
  }

  const post = await getPost(id);

  return <ChatRoom chatRoom={chatRoom} post={post} allusers={user} />;
}
