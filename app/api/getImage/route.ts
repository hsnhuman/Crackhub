import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
  }

  const imageData = await prisma.imageurl.findFirst({
    where: { gameId },
  });

  console.log("Fetched image data:", imageData); // 🛠 Debugging log

  if (!imageData) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  return NextResponse.json({ url: imageData.imageurl }); // ✅ Fix her
}
