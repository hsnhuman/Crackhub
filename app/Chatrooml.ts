"use server";

export default async function Userleft({ userId, chatRoomId }) {
  if (!userId || !chatRoomId) {
    throw new Error("Missing userId or chatRoomId");
  }

  try {
    const response = await fetch("http://localhost:3000/api/pusher/auth", {
      method: "DELETE",
      body: JSON.stringify({ userId, chatRoomId }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.log("failed to remove user");
    }

    return response.json();
  } catch (error) {
    console.error("Error removing user:", error);
    throw error;
  }
}
