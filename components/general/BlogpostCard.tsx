"use client";
import Link from "next/link";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

interface iappProps {
  post: {
    id: string;
    title: string;
    content: string;
    game: string;
    authorid: string;
    authorName: string;
    authorimage: string;
    createdat: Date;
    updatedat: Date;
    scheduled: Date;
  };
}

export default function BlogpostCard({ post }: iappProps) {
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

  const currentTime = new Date();
  const timeDiff =
    (currentTime.getTime() - new Date(post.scheduled).getTime()) / 60000;
  const isLive = Math.abs(timeDiff) <= 60;

  const chatRoomPresence = presence?.find(
    (p) => p.chatRoom.blogpostId === post.id && p.userPresence
  );

  return (
    <div className="relative rounded-lg border border-gray-300 bg-white shadow-lg transition-all hover:shadow-xl">
      <Link href={`/post/${post.id}`} className="block p-5">
        {isLive && (
          <span className="absolute top-2 right-2 rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            LIVE
          </span>
        )}
        <h3 className="mb-2 text-xl font-bold text-gray-700">{post.title}</h3>
        <p className="mb-3 text-sm text-gray-500">{post.content}</p>
        <p className="mb-3 text-sm font-medium text-gray-600">{post.game}</p>
        <p className="text-xs text-gray-400">
          {new Date(post.scheduled).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <img
            src={post.authorimage}
            alt="authorimage"
            className="h-10 w-10 rounded-full border border-gray-400"
          />
          <p className="text-sm font-semibold text-gray-700">
            {post.authorName}
          </p>
        </div>
        <div className="mt-4 rounded border border-red-500 bg-red-50 p-3 text-center">
          {chatRoomPresence && (
            <h4 className="text-sm font-semibold text-red-600">
              Chatroom is LIVE!
            </h4>
          )}
          <div className="mt-2 rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">
            Join Chat
          </div>
        </div>
      </Link>
    </div>
  );
}
