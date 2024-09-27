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
}

interface CommentSectionProps {
  postId: number;
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
      setComments(data as Comment[]);
    }
  }, [supabase, postId]);

  const fetchUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }, [supabase]);

  useEffect(() => {
    fetchComments();
    fetchUser();
  }, [fetchComments, fetchUser]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("Comment")
      .insert({
        content: newComment,
        postId,
        authorId: user.id,
        createdAt: now,
        updatedAt: now,
      })
      .select();

    if (error) {
      console.error("Error submitting comment:", error);
    } else if (data) {
      setNewComment("");
      fetchComments();
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!user) return;

    const { error } = await supabase
      .from("Comment")
      .delete()
      .eq("id", commentId)
      .eq("authorId", user.id);

    if (error) {
      console.error("Error deleting comment:", error);
    } else {
      fetchComments();
    }
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
