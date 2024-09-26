"use client";

import { useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: { name: string };
  upvotes: number;
  downvotes: number;
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export default function CommentSection({
  postId,
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const supabase = createClientComponentClient();

  const fetchComments = useCallback(async () => {
    const { data: commentsData, error: commentsError } = await supabase
      .from("Comment")
      .select(`*, author:User (name)`)
      .eq("postId", postId)
      .order("createdAt", { ascending: false });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
    } else {
      setComments(commentsData || []);
    }
  }, [postId, supabase]);

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    try {
      const method = "POST";

      const response = await fetch("/api/comments", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          postId: postId,
          authorId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const data = await response.json();

      const newCommentWithAuthor = {
        ...data,
        author: { name: user.user_metadata.full_name || "Anonymous" },
        upvotes: 0,
        downvotes: 0,
      };

      setComments([newCommentWithAuthor, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Error submitting comment. Please try again.");
    }
  }

  async function handleVote(
    commentId: number,
    voteType: "upvote" | "downvote"
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to vote.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("CommentVote")
        .upsert(
          {
            userId: user.id,
            commentId: commentId,
            voteType: voteType,
          },
          { onConflict: "userId, commentId" }
        )
        .select();

      if (error) throw error;

      console.log("Vote data:", data);
      await fetchComments();
    } catch (error) {
      console.error("Detailed error when voting:", error);
      alert("Error voting. Please try again.");
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        Comments ({comments.length})
      </h2>
      <form onSubmit={handleCommentSubmit} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded"
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit Comment
        </button>
      </form>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-4 p-4 border rounded">
          <p>{comment.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            By {comment.author.name} ·{" "}
            {new Date(comment.createdAt).toLocaleString()}
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={() => handleVote(comment.id, "upvote")}
              className="text-green-500 hover:text-green-700"
            >
              ▲ {comment.upvotes}
            </button>
            <button
              onClick={() => handleVote(comment.id, "downvote")}
              className="text-red-500 hover:text-red-700"
            >
              ▼ {comment.downvotes}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
