"use server";
import { prisma } from "./utils/db";
import { pusher } from "./utils/pusher";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Sendmessages(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const content =
    (formData.get("content") as string | null) ?? "Default message";
  const chatRoomData = formData.get("chatRoom") as string | null;
  const chatRoomId = chatRoomData ? JSON.parse(chatRoomData).id : null;

  const newMessage = await prisma.message.create({
    data: {
      content,
      chatRoomId,
      authorName: user.given_name ?? "Unknown User",
    },
  });

  // Notify Pusher
  await pusher.trigger(`chat-${chatRoomId}`, "new-message", {
    message: newMessage.content,
    chatRoomId: newMessage.chatRoomId,
    authorName: newMessage.authorName, // Ensure this field is included
  });
}
