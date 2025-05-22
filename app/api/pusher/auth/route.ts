import { NextResponse } from "next/server";
import Pusher from "pusher";
import { auth } from "@/app/auth/auth";
import { prisma } from "@/app/utils/db"; // Import Prisma Client

// Initialize Pusher instance
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true, // Ensure secure connections
});

export async function POST(req: Request) {
  try {
    // Authenticate session
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized: No user found" },
        { status: 401 }
      );
    }

    // Parse request body
    const bodyText = await req.text();
    const body = new URLSearchParams(bodyText);

    const socket_id = body.get("socket_id");
    const channel_name = body.get("channel_name");

    if (!socket_id || !channel_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Extract ChatRoom ID from channel_name
    const parts = channel_name.split("-");
    const chatRoomId = parts.slice(2).join("-");

    // Ensure ChatRoom exists
    const chatRoomExists = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoomExists) {
      return NextResponse.json(
        { error: "ChatRoom does not exist" },
        { status: 400 }
      );
    }

    // Authenticate user for presence channel
    const pauth = pusher.authorizeChannel(socket_id, channel_name, {
      user_id: user.id,
      user_info: { given_name: user.name || "Anonymous" },
    });

    // Update presence in Prisma when user joins
    await prisma.inChatRoom.upsert({
      where: { userId_chatRoomId: { userId: user.id, chatRoomId } },
      update: { userPresence: true },
      create: { userId: user.id, chatRoomId, userPresence: true },
    });

    return NextResponse.json(pauth);
  } catch (error) {
    console.error("Pusher authorization error:", error);
    return NextResponse.json(
      { error: "Failed to authorize channel" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    if (req.method !== "DELETE") {
      return NextResponse.json(
        { error: "Method Not Allowed" },
        { status: 405 }
      );
    }

    const { userId, chatRoomId } = await req.json();

    if (!userId || !chatRoomId) {
      return NextResponse.json(
        { error: "Missing userId or chatRoomId" },
        { status: 400 }
      );
    }

    await prisma.inChatRoom.delete({
      where: { userId_chatRoomId: { userId, chatRoomId } },
    });

    await pusher.trigger(`presence-chat-${chatRoomId}`, "member-left", {
      user_id: userId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing user from chat:", error);
    return NextResponse.json(
      { error: "Failed to remove user" },
      { status: 500 }
    );
  }
}
