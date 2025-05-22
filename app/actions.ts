"use server";

import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import { auth } from "./auth/auth";

export async function handleSubmition(formData: FormData) {
  const session = await auth();
  const user = session?.user;
  console.log(user);

  if (!user) {
    return redirect("/api/auth/register");
  }

  const title = formData.get("title");
  const content = formData.get("content");
  const game = formData.get("game");
  const scheduledRaw = formData.get("scheduled_at") as string | null;
  const isPrivate = formData.get("private") === "on"; // Check if the checkbox is ticked

  if (!scheduledRaw) {
    throw new Error("Scheduled date is missing");
  }

  const newBlogpost = await prisma.blogpost.create({
    data: {
      title: title as string,
      content: content as string,
      game: game as string,
      authorid: user.id,
      scheduled: new Date(scheduledRaw),
      authorName: user.name as string,
      authorimage: user.image,
      private: isPrivate, // Store the private field
      chatRoom: {
        create: {
          name: "ChatRoom for this blog",
        },
      },
    },
    include: {
      chatRoom: true,
    },
  });

  console.log(newBlogpost);
  return redirect("/dashboard");
}
