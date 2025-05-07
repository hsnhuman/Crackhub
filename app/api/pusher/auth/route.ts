import { NextResponse } from "next/server";
import Pusher from "pusher";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
    const { getUser } = getKindeServerSession();
    const user = await getUser(); // Ensure the user is correctly retrieved

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized: No user found" },
        { status: 401 }
      );
    }

    // Read and parse body correctly
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

    // Authenticate user in presence channel with a unique user identifier
    const auth = pusher.authenticate(socket_id, channel_name, {
      user_id: user.id,
      user_info: { given_name: user.given_name || "Anonymous" },
    });

    // Emit an event to notify other users of this member joining
    await pusher.trigger(channel_name, "member-joined", {
      user_id: user.id,
      given_name: user.given_name || "Anonymous",
    });

    return NextResponse.json(auth);
  } catch (error) {
    console.error("Pusher authorization error:", error);
    return NextResponse.json(
      { error: "Failed to authorize channel" },
      { status: 500 }
    );
  }
}
