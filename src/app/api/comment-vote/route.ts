import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  console.log("GET request received for comment votes");
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    console.log("PostId:", postId);

    if (!postId) {
      console.log("PostId is missing");
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    console.log("Attempting to fetch votes from database");
    const votes = await prisma.commentVote.groupBy({
      by: ["commentId"],
      where: {
        comment: {
          postId: Number(postId),
        },
      },
      _sum: {
        value: true,
      },
    });

    console.log("Votes fetched successfully:", votes);
    return NextResponse.json(votes);
  } catch (error) {
    console.error("Detailed error in GET /api/comment-vote:", error);
    return NextResponse.json(
      { error: "Error fetching votes", details: JSON.stringify(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { commentId, userId, value } = await req.json();
    const vote = await prisma.commentVote.upsert({
      where: {
        commentId_userId: {
          commentId: Number(commentId),
          userId: userId,
        },
      },
      update: { value: value },
      create: {
        commentId: Number(commentId),
        userId: userId,
        value: value,
      },
    });
    return NextResponse.json(vote);
  } catch (error) {
    console.error("Error voting:", error);
    return NextResponse.json({ error: "Error voting" }, { status: 500 });
  }
}
