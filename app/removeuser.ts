"use server";

import { prisma } from "./utils/db";
import Pusher from "pusher";

export default async function removeUser({ userId, chatRoomId }) {
  if (!userId || !chatRoomId) {
    throw new Error("Missing userId or chatRoomId");
  }

  try {
    // Create a Blocked entry in Prisma
    const block = await prisma.blocked.create({
      data: {
        userId: userId,
        chatRoomId: chatRoomId,
        isBlocked: true,
      },
    });

    console.log("User blocked:", block);

    // Initialize Pusher server-side instance
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS: true,
    });

    // Notify the frontend that the user has been removed
    await pusher.trigger(`presence-chat-${chatRoomId}`, "client-user-kicked", {
      userId,
    });

    // Send DELETE request to remove user from Pusher presence
    const response = await fetch("http://localhost:3000/api/pusher/auth", {
      method: "DELETE",
      body: JSON.stringify({ userId, chatRoomId }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Failed to remove user from Pusher");
      throw new Error("Pusher removal failed");
    }

    return response.json();
  } catch (error) {
    console.error("Error blocking user and removing from Pusher:", error);
    throw error;
  }
}
