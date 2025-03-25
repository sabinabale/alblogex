import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching post titles:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch post titles",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
