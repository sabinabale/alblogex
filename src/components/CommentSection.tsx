import React, { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import profilepic from "@/assets/images/profilepic.jpg";
import chevronup from "@/assets/icons/chevronup.svg";
import chevrondown from "@/assets/icons/chevrondown.svg";
import cross from "@/assets/icons/cross.svg";

type Comment = {
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
};

type CommentSectionProps = {
  postId: number;
};

type VoteData = {
  commentId: number;
  _sum: {
    value: number;
  };
};

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

    const now = new Date().toISOString();

    const { error } = await supabase.from("Comment").insert({
      content: newComment,
      postId,
      authorId: user.id,
      createdAt: now,
      updatedAt: now,
    });

    if (error) {
      console.error("Error submitting comment:", error);
    } else {
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
    <div className="mt-8 border-t pt-8 border-gray-300">
      <h4>Comments ({comments.length})</h4>
      {user && (
        <div className="flex gap-4 mt-8 mb-6">
          <div className="bg-gray-200 rounded-full w-11 h-11 flex-shrink-0">
            <Image
              src={profilepic}
              alt="User Avatar"
              width={44}
              height={44}
              className="h-11 w-11 object-cover rounded-full outline outline-1 outline-black/30"
            />
          </div>
          <form onSubmit={handleSubmitComment} className="relative w-full">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-md resize-none text-base"
              placeholder="Join the discussion"
              required
              maxLength={500}
            />
            <button
              type="submit"
              className="absolute bottom-3 right-1 w-fit px-1 py-0.5 rounded-md"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-20 hover:opacity-100 transition-all duration-200 ease-in-out "
              >
                <path
                  d="M5.99997 12H9.24997M5.99997 12L3.3817 4.14513C3.24083 3.72253 3.68122 3.34059 4.07964 3.5398L20.1055 11.5528C20.4741 11.737 20.4741 12.2629 20.1055 12.4472L4.07964 20.4601C3.68122 20.6593 3.24083 20.2774 3.3817 19.8548L5.99997 12Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
      {comments.map((comment) => (
        <div key={comment.id} className="mb-6 flex gap-4">
          <div className="bg-gray-200 rounded-full w-11 h-11 flex-shrink-0"></div>
          <div>
            <div className="flex items-center mb-2 gap-2">
              <span className="font-bold">{comment.User.name}</span>
              <span className="text-sm text-gray-500">
                {(() => {
                  const now = new Date();
                  const createdAt = new Date(comment.createdAt);
                  const diffInHours = Math.floor(
                    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
                  );

                  if (diffInHours < 24) {
                    return `${diffInHours} hour${
                      diffInHours !== 1 ? "s" : ""
                    } ago`;
                  } else if (diffInHours < 48) {
                    return "yesterday";
                  } else {
                    const diffInDays = Math.floor(diffInHours / 24);
                    return `${diffInDays} day${
                      diffInDays !== 1 ? "s" : ""
                    } ago`;
                  }
                })()}
              </span>
            </div>
            <p>{comment.content}</p>
            <div className="mt-2 flex items-center">
              {user && (
                <>
                  <span className="mr-4">
                    {formatVoteCount(comment.voteCount)}
                  </span>
                  <button
                    onClick={() => handleVote(comment.id, 1)}
                    className="px-2 py-1 w-fit"
                  >
                    <Image
                      src={chevronup}
                      alt="Upvote comment"
                      width={40}
                      height={40}
                      className="opacity-50 hover:opacity-100 transition-all duration-200 ease-in-out"
                    />
                  </button>

                  <button
                    onClick={() => handleVote(comment.id, -1)}
                    className="px-2 py-1 w-fit"
                  >
                    <Image
                      src={chevrondown}
                      alt="Downvote comment"
                      width={40}
                      height={40}
                      className="opacity-50 hover:opacity-100 transition-all duration-200 ease-in-out"
                    />
                  </button>
                </>
              )}

              {user && user.id === comment.User.id && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="px-2 py-1 w-fit opacity-50 hover:opacity-100 transition-all duration-200 ease-in-out"
                >
                  <Image
                    src={cross}
                    alt="Delete comment"
                    width={30}
                    height={30}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
