import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const content = formData.get("content") as string | null;
    const image = formData.get("image") as File | null;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const authorId = session.user.id.toString();

    let imageUrl: string | null = null;
    let fileName: string | null = null;

    if (image) {
      try {
        fileName = `${Date.now()}_${image.name}`;
        console.log("Uploading image:", fileName);

        const arrayBuffer = await image.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { error: uploadError } = await supabase.storage
          .from("alblogex-postimages")
          .upload(`${authorId}/${fileName}`, buffer, {
            contentType: image.type,
          });

        if (uploadError) {
          console.error(
            "Supabase storage error:",
            JSON.stringify(uploadError, null, 2)
          );
          throw new Error(`Upload error: ${uploadError.message}`);
        }

        console.log("Image uploaded successfully");

        const { data: urlData } = supabase.storage
          .from("alblogex-postimages")
          .getPublicUrl(`${authorId}/${fileName}`);

        imageUrl = urlData.publicUrl;
        console.log("Image public URL:", imageUrl);
      } catch (imageError) {
        console.error("Error handling image:", imageError);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to process image",
            details:
              imageError instanceof Error
                ? imageError.message
                : String(imageError),
          },
          { status: 500 }
        );
      }
    }

    console.log("Creating post in database");
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    if (imageUrl && fileName) {
      await prisma.postImage.create({
        data: {
          url: imageUrl,
          fileName,
          postId: post.id,
        },
      });
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
