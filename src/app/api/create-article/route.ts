import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
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

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const authorId = session.user.id;
    console.log("Attempting to create post with authorId:", authorId);

    const user = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    console.log("Creating post in database");
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    let imageUrl: string | null = null;
    let fileName: string | null = null;

    if (image) {
      try {
        fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}.jpg`;
        console.log("Uploading image:", fileName);

        const { error: uploadError } = await supabase.storage
          .from("alblogex-postimages")
          .upload(`${authorId}/${fileName}`, image, {
            contentType: image.type || "image/jpeg",
          });

        if (uploadError) {
          throw uploadError;
        }

        console.log("Image uploaded successfully");

        const { data: urlData } = supabase.storage
          .from("alblogex-postimages")
          .getPublicUrl(`${authorId}/${fileName}`);

        imageUrl = urlData.publicUrl;
        console.log("Image public URL:", imageUrl);

        if (imageUrl) {
          await prisma.postImage.create({
            data: {
              url: imageUrl,
              fileName,
              postId: post.id,
            },
          });
        }
      } catch (imageError) {
        console.error("Error handling image:", imageError);
      }
    }

    return NextResponse.json({ success: true, id: post.id });
  } catch (error) {
    console.error("Error in create-article route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
