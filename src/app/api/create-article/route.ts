import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  return handleArticle(request, "create");
}

export async function PUT(request: Request) {
  return handleArticle(request, "update");
}

async function handleArticle(request: Request, action: "create" | "update") {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const content = formData.get("content") as string | null;
    const image = formData.get("image") as Blob | null;
    const postId = formData.get("postId")
      ? Number(formData.get("postId"))
      : null;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (action === "update" && !postId) {
      return NextResponse.json(
        { success: false, error: "Missing postId for update" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;
    if (image) {
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}.jpg`;
      const filePath = `${session.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("alblogex-postimages")
        .upload(filePath, image, {
          contentType: image.type || "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("alblogex-postimages")
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    }

    let post;
    if (action === "update") {
      // Update existing post
      post = await prisma.post.update({
        where: { id: postId! },
        data: {
          title,
          content,
          imageUrl,
        },
      });
    } else {
      // Create new post
      post = await prisma.post.create({
        data: {
          title,
          content,
          imageUrl,
          authorId: session.user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      id: post.id,
      imageUrl: post.imageUrl,
    });
  } catch (error) {
    console.error("Error in article route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to handle article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
