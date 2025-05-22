import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";
import { genarateVereficationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate a new verification token
    const verificationToken = await genarateVereficationToken(email);

    // Send the verification email
    await sendVerificationEmail(email, verificationToken.token);

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resending verification email:", error);
    return NextResponse.json(
      { error: "Error resending verification email" },
      { status: 500 }
    );
  }
}
