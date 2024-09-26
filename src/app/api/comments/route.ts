import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { content, postId, authorId } = await req.json();
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: Number(postId),
        authorId,
      },
    });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Error creating comment" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get("id");

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });
    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error retrieving comment:", error);
    return NextResponse.json(
      { message: "Error retrieving comment" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, content } = await req.json();
    const updatedComment = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content },
    });
    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { message: "Error updating comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get("id");

  try {
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });
    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Error deleting comment" },
      { status: 500 }
    );
  }
}
