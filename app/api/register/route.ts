import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { genarateVereficationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "email already exists" },
        { status: 400 }
      );
    }
    const exsitingName = await prisma.user.findUnique({
      where: { name: username },
    });
    if (exsitingName) {
      return NextResponse.json(
        { error: "username already exists" },
        { status: 400 }
      );
    }

    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name: username },
    });

    const verificationToken = await genarateVereficationToken(email);

    await sendVerificationEmail(email, verificationToken.token);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error registering user" },
      { status: 500 }
    );
  }
}
