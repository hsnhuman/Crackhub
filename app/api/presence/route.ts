import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";
import { prisma } from "@/app/utils/db";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let body;

    try {
      body = JSON.parse(rawBody);
    } catch {
      const params = new URLSearchParams(rawBody);
      body = Object.fromEntries(params.entries());
    }

    if (!body.socket_id || !body.channel_name) {
      return NextResponse.json(
        { error: "Missing authentication parameters" },
        { status: 400 }
      );
    }

    const user = { id: "sample-user-id", name: "Guest User" };
    const channelData = JSON.stringify(user);

    try {
      const authResponse = pusher.authorizeChannel(
        body.socket_id,
        body.channel_name,
        channelData
      );

      // **Trigger Presence Update**
      const presenceData = await prisma.inChatRoom.findMany({
        include: { chatRoom: { include: { blogpost: true } } },
      });

      pusher.trigger("presence-new", "presence-update", {
        presenceData, // Ensure the latest presence data is sent to all users
      });

      return NextResponse.json(authResponse);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to authorize with Pusher" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const presenceData = await prisma.inChatRoom.findMany({
      include: {
        chatRoom: {
          include: {
            blogpost: true,
          },
        },
      },
    });

    return NextResponse.json(
      { status: "success", presenceData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch presence data" },
      { status: 500 }
    );
  }
}
