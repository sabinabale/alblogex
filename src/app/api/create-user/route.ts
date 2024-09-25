import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { id, name, email } = await request.json();

    const user = await prisma.user.create({
      data: {
        id,
        name,
        email,
        password: "placeholder_password",
        role: "USER",
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
