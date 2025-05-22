import { auth } from "@/app/auth/auth";
import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ count: 0 });

  const inviteCount = await prisma.invitations.count({
    where: { userId: session.user.id, read: false },
  });

  return NextResponse.json({ count: inviteCount });
}
