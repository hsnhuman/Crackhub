"use client";
import Link from "next/link";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

interface iappProps {
  post: {
    id: string;
    content: string;
    scheduled: Date;
    userId: string;
    blogpostId: string;
    createdAt: Date;
  };
  bpost: {
    id: string;
    title: string;
    content: string;
    game: string;
    authorid: string;
    authorName: string;
    authorimage: string | null;
    createdat: Date;
    updatedat: Date;
    scheduled: Date;
    private: boolean;
  };
}

export default function InviteCard({ post, bpost }: iappProps) {
  const [presence, setPresence] = useState<any[]>([]);

  useEffect(() => {
    const fetchPresenceData = async () => {
      try {
        const response = await fetch("/api/presence");
        const data = await response.json();
        setPresence(data.presenceData || []);
      } catch (error) {}
    };

    fetchPresenceData();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/presence",
      auth: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    });

    const channel = pusher.subscribe("presence-new");

    channel.bind("presence-update", (data) => {
      if (data.presenceData) {
        setPresence(data.presenceData);
      }
    });

    return () => {
      pusher.disconnect();
    };
  }, []);
  const scheduledTime = new Date(post.scheduled).getTime();
  const currentTime = new Date().getTime();
  const timeDiff = Math.abs(currentTime - scheduledTime) / (1000 * 60); // Difference in minutes

  let statusLabel = "";
  let cardStyles =
    "relative rounded-lg border border-gray-300 bg-white shadow-lg transition-all hover:shadow-xl p-5";

  if (timeDiff <= 60) {
    statusLabel = "LIVE";
  } else if (currentTime > scheduledTime && timeDiff > 61) {
    cardStyles += " opacity-60"; // Darken the page
    statusLabel = "Event Over";
  } else if (currentTime < scheduledTime) {
    statusLabel = "Commencing Soon";
  }
  const chatRoomPresence = presence?.find(
    (p) => p.chatRoom.blogpostId === bpost.id && p.userPresence
  );

  return (
    <div className={cardStyles}>
      {statusLabel && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded">
          {statusLabel}
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800">
        Sent by: {bpost.authorName}
      </h2>
      <h2 className="text-lg font-semibold text-gray-800">
        Game: {bpost.game}
      </h2>
      <p className="text-gray-600">Event context: {bpost.content}</p>

      <div className="mt-3 text-sm text-gray-500">
        <p>Scheduled: {new Date(post.scheduled).toLocaleString()}</p>
        <p>Sent at: {new Date(post.createdAt).toLocaleString()}</p>
      </div>
      {chatRoomPresence && (
        <h4 className="text-sm font-semibold text-red-600">
          Chatroom is LIVE!
        </h4>
      )}
      <Link
        href={`/post/${post.blogpostId}`}
        className="mt-4 block text-center text-white bg-blue-500 hover:bg-blue-600 rounded-md py-2 px-4 transition"
      >
        Join Chat
      </Link>
    </div>
  );
}
