"use client";
import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import Message from "./SendMessage";
import { useSession } from "next-auth/react";
import Userleft from "@/app/Chatrooml";
import Removeuser from "@/app/removeuser";
import InviteUser from "@/app/inviteuser";

export default function ChatRoom({ chatRoom, post, allusers }) {
  console.log(
    "allusers",
    allusers.map((user) => user.name)
  );
  const { data: session } = useSession();
  const user = session?.user;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInviteExpanded, setIsInviteExpanded] = useState(false);

  const [messages, setMessages] = useState(chatRoom?.messages || []);
  const [users, setUsers] = useState<{ id: string; given_name: string }[]>([]);
  const usersRef = useRef(users); // ✅ Store users in a ref

  useEffect(() => {
    // Load existing users from localStorage
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
      usersRef.current = JSON.parse(savedUsers); // ✅ Update ref
    }

    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });

    const presenceChannel = pusher.subscribe(`presence-chat-${chatRoom.id}`);

    presenceChannel.bind("pusher:subscription_succeeded", (members) => {
      const usersArray = Object.entries(members.members).map(([id, user]) => ({
        id,
        given_name: user.given_name,
      }));

      setUsers(usersArray);
      usersRef.current = usersArray; // ✅ Update ref
      localStorage.setItem("users", JSON.stringify(usersArray));
    });

    presenceChannel.bind("pusher:member_added", (member) => {
      setUsers((prevUsers) => {
        const updatedUsers = [
          ...prevUsers,
          { id: member.id, given_name: member.info.given_name },
        ];

        usersRef.current = updatedUsers; // ✅ Update ref
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        return updatedUsers;
      });
    });

    presenceChannel.bind("pusher:member_removed", (member) => {
      if (!member?.id) return;

      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter((user) => user.id !== member.id);
        usersRef.current = updatedUsers; // ✅ Update ref
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        return updatedUsers;
      });

      Userleft({
        userId: member.userId ?? member.id,
        chatRoomId: chatRoom.id,
      });

      fetch("/api/pusher/auth", {
        method: "DELETE",
        body: JSON.stringify({
          userId: member.userId ?? member.id,
          chatRoomId: chatRoom.id,
        }),
        headers: { "Content-Type": "application/json" },
      }).catch((error) => console.error("Error removing user:", error));

      // ✅ Emit an event to notify the removed user
      presenceChannel.trigger("client-user-kicked", {
        userId: member.id,
      });
    });

    const chatChannel = pusher.subscribe(`chat-${chatRoom.id}`);
    chatChannel.bind("new-message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: data.message, authorName: data.authorName },
      ]);
    });

    // ✅ Listen for removal event and redirect user
    presenceChannel.bind("client-user-kicked", (data) => {
      if (user?.id === data.userId) {
        alert("You have been removed from the chatroom.");
        window.location.href = "/blocked"; // Redirect to the homepage or another page
      }
    });

    return () => {
      if (usersRef.current.length > 0 && usersRef.current[0]?.id) {
        Userleft({
          userId: usersRef.current[0].id,
          chatRoomId: chatRoom.id,
        });
      } else {
        console.warn("No users found on unmount.");
      }

      pusher.unsubscribe(`chat-${chatRoom.id}`);
      pusher.unsubscribe(`presence-chat-${chatRoom.id}`);
    };
  }, [chatRoom.id]); // ✅ Only depends on `chatRoom.id`

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <aside className="w-[15%] bg-gray-900 bg-opacity-75 shadow-lg p-4 flex-shrink-0 rounded-l-lg">
        <h1 className="text-xl font-bold mb-2 text-white">
          Users Present: {users.length}
        </h1>
        {user?.id === post.authorid && (
          <div>
            {/* Invitation List Toggle Button */}
            <button
              onClick={() => setIsInviteExpanded(!isInviteExpanded)}
              className="w-full p-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              {isInviteExpanded ? "Hide Invite List" : "Invite Users"}
            </button>

            {/* Expandable user invitation list */}
            {isInviteExpanded && (
              <ul className="text-gray-300 text-sm mt-2 border-t border-gray-600 pt-2">
                {allusers.length > 0 ? (
                  allusers.map((inviteUser) => {
                    return (
                      <li
                        key={inviteUser.id}
                        className="flex flex-col justify-between items-start space-y-2"
                      >
                        {inviteUser.name}

                        {/* Invite Button */}
                        <button
                          onClick={() => {
                            InviteUser(
                              inviteUser.id,
                              post.id,
                              "You're invited!",
                              post.scheduled
                            )
                              .then(() => alert("User invited successfully!"))
                              .catch((error) =>
                                alert("Error inviting user: " + error.message)
                              );
                          }}
                          className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          Invite
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <p>No users available for invitation</p>
                )}
              </ul>
            )}
          </div>
        )}

        <ul className="text-gray-300 text-sm">
          {users.length > 0 ? (
            users.map((chatUser) => (
              <li
                key={chatUser.id}
                className="flex justify-between items-center"
              >
                {chatUser.given_name}

                {/* Show remove button only if the current user is the post author AND the user being listed is not the author */}
                {user?.id === post.authorid &&
                  chatUser.id !== post.authorid && (
                    <button
                      onClick={() =>
                        Removeuser({
                          userId: chatUser.id,
                          chatRoomId: chatRoom.id,
                        })
                      }
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ❌
                    </button>
                  )}
              </li>
            ))
          ) : (
            <p>No users present</p>
          )}
        </ul>
      </aside>

      <div className="flex-1 flex flex-col p-4 bg-gray-900 bg-opacity-75 rounded-r-lg shadow-lg">
        <div className="flex-1 overflow-y-auto border border-gray-700 rounded-lg p-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 bg-gray-800 bg-opacity-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="p-3 border-b border-gray-600 bg-gray-700 rounded-md shadow-sm"
            >
              <img
                src={user?.image || "https://via.placeholder.com/96"}
                alt={`${user?.name}'s profile`}
                className="w-8 h-8 rounded-full border border-gray-500"
              />
              <strong className="text-white text-sm">
                {msg.authorName || "Unknown User"}:
              </strong>{" "}
              <span className="text-gray-200">{msg.content}</span>
            </div>
          ))}
        </div>

        <div className="mt-2 p-3 bg-gray-900 bg-opacity-75 shadow-lg rounded-lg">
          <Message chatRoom={chatRoom} />
        </div>
      </div>
    </div>
  );
}
