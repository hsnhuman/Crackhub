"use server";
import { getVerifacationTokenbyToken } from "@/data/Verefication-token";
import { prisma } from "./utils/db";
import { error } from "console";
import { getUserByEmail } from "@/data/user";

export const newVerification = async (token: string) => {
  const exsitingtoken = await getVerifacationTokenbyToken(token);

  if (!exsitingtoken) {
    return { error: "invalid token" };
  }
  const hasExpierd = new Date(exsitingtoken.expires) < new Date();

  if (hasExpierd) {
    return { error: "token has expierd" };
  }

  const exsitingUser = await getUserByEmail(exsitingtoken.email);

  if (!exsitingUser) {
    return { error: "User not found" };
  }

  await prisma.user.update({
    where: {
      id: exsitingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: exsitingtoken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: {
      id: exsitingtoken.id,
    },
  });
  return { success: "email verified" };
};
