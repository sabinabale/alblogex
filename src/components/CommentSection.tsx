import React, { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  postId: number;
  authorId: string;
  User: {
    name: string;
    id: string;
  };
  voteCount: number;
}

interface CommentSectionProps {
  postId: number;
}

interface VoteData {
  commentId: number;
  _sum: {
    value: number;
  };
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from("Comment")
      .select(
        `
        *,
        User (name, id)
      `
      )
      .eq("postId", postId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
    } else if (data) {
      setComments(data);
    }
  }, [supabase, postId]);

  const fetchVotes = useCallback(async () => {
    try {
      const response = await fetch(`/api/comment-vote?postId=${postId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const votesData: VoteData[] = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) => ({
          ...comment,
          voteCount:
            votesData.find((v) => v.commentId === comment.id)?._sum.value ?? 0,
        }))
      );
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  }, [postId]);

  const fetchUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }, [supabase]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchComments();
    fetchVotes();
  }, [fetchComments, fetchVotes]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { data, error } = await supabase
      .from("Comment")
      .insert({
        content: newComment,
        postId,
        authorId: user.id,
      })
      .select();

    if (error) {
      console.error("Error submitting comment:", error);
    } else if (data) {
      setNewComment("");
      fetchComments();
    }
  };

  const handleVote = async (commentId: number, value: number) => {
    if (!user) return;

    const response = await fetch("/api/comment-vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId, userId: user.id, value }),
    });

    if (response.ok) {
      fetchVotes();
    } else {
      console.error("Error voting");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      const result = await response.json();
      console.log(result.message);

      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const formatVoteCount = (count: number = 0) => {
    if (count > 0) return `+${count}`;
    if (count < 0) return `${count}`;
    return "0";
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {user && (
        <form onSubmit={handleSubmitComment} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Write a comment..."
            required
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit Comment
          </button>
        </form>
      )}
      {comments.map((comment) => (
        <div key={comment.id} className="mb-4 p-4 border rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">{comment.User.name}</span>
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p>{comment.content}</p>
          <div className="mt-2 flex items-center">
            {user && (
              <>
                <button
                  onClick={() => handleVote(comment.id, 1)}
                  className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
                >
                  Upvote
                </button>
                <button
                  onClick={() => handleVote(comment.id, -1)}
                  className="mr-2 px-2 py-1 bg-red-500 text-white rounded"
                >
                  Downvote
                </button>
              </>
            )}
            <span className="mr-4">
              Votes: {formatVoteCount(comment.voteCount)}
            </span>
            {user && user.id === comment.User.id && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="px-2 py-1 bg-gray-500 text-white rounded"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
