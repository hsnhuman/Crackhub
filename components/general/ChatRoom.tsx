"use client"; // Ensure this runs in the browser

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import Message from "./SendMessage";

export default function ChatRoom({ user, chatRoom }) {
  const [messages, setMessages] = useState(chatRoom?.messages || []);
  const [users, setUsers] = useState<{ id: string; given_name: string }[]>([]);

  useEffect(() => {
    // Retrieve users from localStorage if available
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });

    const presenceChannel = pusher.subscribe(`presence-chat-${chatRoom.id}`);

    // Ensure full sync when subscription succeeds
    presenceChannel.bind("pusher:subscription_succeeded", (members) => {
      console.log("Subscribed members:", members.members);
      const usersArray = Object.values(members.members);
      setUsers(usersArray);
      localStorage.setItem("users", JSON.stringify(usersArray)); // Persist users
    });

    // Ensure instant updates when a user joins
    presenceChannel.bind("pusher:member_added", (member) => {
      console.log("User joined:", member);
      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers, member.info];
        localStorage.setItem("users", JSON.stringify(updatedUsers)); // Persist users
        return updatedUsers;
      });
    });

    // Ensure instant updates when a user leaves
    presenceChannel.bind("pusher:member_removed", (member) => {
      console.log("User left:", member);
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter(
          (user) => user.id !== member.info.id
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers)); // Persist users
        return updatedUsers;
      });
    });

    const channel = pusher.subscribe(`chat-${chatRoom.id}`);
    channel.bind("new-message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: data.message, authorName: data.authorName },
      ]);
    });

    return () => {
      pusher.unsubscribe(`chat-${chatRoom.id}`);
      pusher.unsubscribe(`presence-chat-${chatRoom.id}`);
    };
  }, [chatRoom.id]);

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      {/* Users List - 15% width on the left */}
      <aside className="w-[15%] bg-gray-900 bg-opacity-75 shadow-lg p-4 flex-shrink-0 rounded-l-lg">
        <h1 className="text-xl font-bold mb-2 text-white">
          Users Present: {users.length}
        </h1>
        <p className="text-gray-300 text-sm">
          {users.length > 0
            ? users.map((user) => user.given_name).join(", ")
            : "No users present"}
        </p>
      </aside>

      {/* Chat area - remaining space */}
      <div className="flex-1 flex flex-col p-4 bg-gray-900 bg-opacity-75 rounded-r-lg shadow-lg">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto border border-gray-700 rounded-lg p-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 bg-gray-800 bg-opacity-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="p-3 border-b border-gray-600 bg-gray-700 rounded-md shadow-sm"
            >
              <strong className="text-white text-sm">
                {msg.authorName || "Unknown User"}:
              </strong>{" "}
              <span className="text-gray-200">{msg.content}</span>
            </div>
          ))}
        </div>

        {/* Message input placed correctly */}
        <div className="mt-2 p-3 bg-gray-900 bg-opacity-75 shadow-lg rounded-lg">
          <Message chatRoom={chatRoom} user={user} />
        </div>
      </div>
    </div>
  );
}
