import React, { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { CommentSectionProps, Comment } from "@/types/types";
import Link from "next/link";
import { Button } from "../../layout/Buttons";
import AddCommentForm from "./AddCommentForm";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

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
  }, [fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const now = new Date();
    const timestamp = now.toISOString();

    const { error } = await supabase.from("Comment").insert({
      content: newComment,
      postId,
      authorId: user.id,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    if (error) {
      console.error("Error submitting comment:", error);
    } else {
      setNewComment("");
      fetchComments();
    }
  };

  return (
    <div className="mt-8 border-t pt-8 border-gray-200">
      <h4 className="mb-8">Comments</h4>
      <VisitorView user={user} />
      <AddCommentForm
        user={user}
        handleSubmitComment={handleSubmitComment}
        newComment={newComment}
        setNewComment={setNewComment}
      />
      <Comments comments={comments} />
    </div>
  );
}

function formatCommentTime(timestamp: string) {
  try {
    const localDate = dayjs.utc(timestamp).tz(dayjs.tz.guess());

    return localDate.fromNow();
  } catch (error) {
    console.error("Error formatting date:", error);
    return "a few seconds ago";
  }
}

function Comments({ comments }: { comments: Comment[] }) {
  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-6 flex gap-4 ">
          <div className="h-11 w-11 flex-shrink-0 rounded-full outline outline-1 outline-black/20 bg-gray-200 text-black/20 flex items-center justify-center text-lg font-semibold">
            {comment.User.name
              ? comment.User.name.charAt(0).toUpperCase()
              : "AA"}
          </div>
          <div>
            <div className="flex items-center mb-2 gap-2">
              <span className="font-bold">
                {comment.User.name.split(" ")[0]}
              </span>
              <span className="text-sm text-gray-500">
                {formatCommentTime(comment.createdAt)}
              </span>
            </div>
            <p>{comment.content}</p>
          </div>
        </div>
      ))}
    </>
  );
}

function VisitorView({ user }: { user: User | null }) {
  return (
    <>
      {!user && (
        <div>
          <Button variant="link" size="none">
            <Link className="block mb-8 text-base" href="/signin">
              Sign in
            </Link>
          </Button>{" "}
          to add a comment 💬
        </div>
      )}
    </>
  );
}
