import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: { authorId: session.user.id },
      include: {
        images: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Error in GET article route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch articles",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return handleArticle(request, "create");
}

export async function PUT(request: Request) {
  return handleArticle(request, "update");
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const postIds = searchParams.get("postIds");

    if (!postId && !postIds) {
      return NextResponse.json(
        { success: false, error: "Missing postId or postIds for delete" },
        { status: 400 }
      );
    }

    const idsToDelete = postIds
      ? postIds.split(",").map((id) => parseInt(id, 10))
      : [parseInt(postId!, 10)];

    const results = await prisma.$transaction(async (tx) => {
      const deleteResults = [];
      for (const id of idsToDelete) {
        try {
          const post = await tx.post.findUnique({
            where: { id },
            include: { images: true },
          });

          if (!post || post.authorId !== session.user.id) {
            deleteResults.push({ id, status: "not_found_or_unauthorized" });
            continue;
          }

          // Delete associated images from storage
          for (const image of post.images) {
            await supabase.storage
              .from("alblogex-postimages")
              .remove([`${session.user.id}/${image.fileName}`]);
          }

          // Delete PostImage records
          await tx.postImage.deleteMany({
            where: { postId: id },
          });

          // Delete the post
          await tx.post.delete({
            where: { id },
          });

          deleteResults.push({ id, status: "deleted" });
        } catch (error) {
          console.error(`Error deleting post ${id}:`, error);
          deleteResults.push({
            id,
            status: "error",
            message: error instanceof Error ? error.message : String(error),
          });
        }
      }
      return deleteResults;
    });

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Error in DELETE article route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete article(s)",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
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
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File | null;
    const existingImageUrl = formData.get("imageUrl") as string | null;
    const postId = formData.get("postId")
      ? parseInt(formData.get("postId") as string)
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
    let fileName: string | null = null;

    if (image) {
      fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = `${session.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("alblogex-postimages")
        .upload(filePath, image);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("alblogex-postimages")
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    } else if (existingImageUrl) {
      imageUrl = existingImageUrl;
    }

    const result = await prisma.$transaction(async (tx) => {
      let post;
      if (action === "update") {
        post = await tx.post.update({
          where: { id: postId! },
          data: {
            title,
            content,
            imageUrl,
          },
        });

        if (imageUrl && image) {
          await tx.postImage.upsert({
            where: { postId: postId! },
            update: {
              url: imageUrl,
              fileName: fileName!,
            },
            create: {
              postId: postId!,
              url: imageUrl,
              fileName: fileName!,
            },
          });
        }
      } else {
        post = await tx.post.create({
          data: {
            title,
            content,
            imageUrl,
            authorId: session.user.id,
            images:
              imageUrl && image
                ? {
                    create: {
                      url: imageUrl,
                      fileName: fileName!,
                    },
                  }
                : undefined,
          },
        });
      }

      return post;
    });

    return NextResponse.json({
      success: true,
      id: result.id,
      imageUrl: result.imageUrl,
    });
  } catch (error) {
    console.error("Error in handleArticle:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to handle article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
