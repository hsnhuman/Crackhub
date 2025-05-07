"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";

export async function handleSubmition(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/api/auth/register");
  }
  const title = formData.get("title");
  const content = formData.get("content");
  const game = formData.get("game");
  const scheduledRaw = formData.get("scheduled_at") as string | null;
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
      authorName: user.given_name as string,
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
