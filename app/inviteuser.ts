"use server";
import { prisma } from "./utils/db";

export default async function InviteUser(
  userId,
  postId,
  content = "You're invited!",
  scheduled
) {
  if (!userId || !postId || !scheduled) {
    throw new Error("Missing required fields: userId, postId, or scheduled");
  }

  try {
    // Check if the user is already invited
    const existingInvitation = await prisma.invitations.findFirst({
      where: {
        userId,
        blogpostId: postId,
      },
    });

    if (existingInvitation) {
      throw new Error("User is already invited");
    }

    return await prisma.invitations.create({
      data: {
        user: { connect: { id: userId } }, // ✅ Use relation reference instead of `userId`
        blogpost: { connect: { id: postId } },
        content,
        scheduled,
      },
    });
  } catch (error) {
    return { error: error.message };
  }
}
