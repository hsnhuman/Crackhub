"use server";
import { auth } from "./auth/auth";
import { prisma } from "./utils/db";
import { pusher } from "./utils/pusher";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Sendmessages(formData: FormData) {
  const session = await auth();
  const user = session?.user;
  const content =
    (formData.get("content") as string | null) ?? "Default message";
  const chatRoomData = formData.get("chatRoom") as string | null;
  const chatRoomId = chatRoomData ? JSON.parse(chatRoomData).id : null;

  const newMessage = await prisma.message.create({
    data: {
      content,
      chatRoomId,
      authorName: user?.name ?? "Unknown User",
      authorPicture: user?.image ?? "",
    },
  });

  // Notify Pusher
  await pusher.trigger(`chat-${chatRoomId}`, "new-message", {
    message: newMessage.content,
    chatRoomId: newMessage.chatRoomId,
    authorName: newMessage.authorName, // Ensure this field is included
  });
}
