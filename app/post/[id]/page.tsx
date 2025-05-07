import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../../utils/db";
import Message from "@/components/general/SendMessage";
import ChatRoom from "@/components/general/ChatRoom";
async function getData(postId: string) {
  "use server";

  let chatRoom = await prisma.chatRoom.findUnique({
    where: { blogpostId: postId }, // Check for existing chat room
    include: { messages: true },
  });

  // If no chat room exists, create one
  if (!chatRoom) {
    chatRoom = await prisma.chatRoom.create({
      data: {
        name: `Chat Room for Blogpost ${postId}`,
        blogpostId: postId, // Link chat room to blog post
      },
      include: { messages: true },
    });
  }

  return chatRoom ?? { messages: [], name: "Default Room", id: "default-id" };
}

export default async function Post({ params }: { params: { id: string } }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const awaitedParams = await params; // Await params before accessing its properties
  const id = awaitedParams.id;

  const chatRoom = await getData(id);
  return <ChatRoom chatRoom={chatRoom} user={user} />;
}
