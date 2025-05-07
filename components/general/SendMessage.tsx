"use client";
import Sendmessages from "@/app/Messageactions";
import { Textarea } from "../ui/textarea";
interface iappProps {
  chatRoom: { content: string } | null;
}

export default function Message({ chatRoom }: iappProps) {
  return (
    <form
      className="flex flex-col space-y-2 p-4 bg-gray-800 rounded-lg shadow-md"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        // Ensure chatRoom exists before appending
        if (chatRoom) {
          formData.append("chatRoom", JSON.stringify(chatRoom));
        }

        await Sendmessages(formData);
      }}
    >
      {/* Textarea styled to fill the width and have a nice appearance */}
      <Textarea
        required
        name="content"
        placeholder="Type your message..."
        className="w-full resize-none p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* Button styled to match the form */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Send
        </button>
      </div>
    </form>
  );
}
