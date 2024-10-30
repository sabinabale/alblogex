import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-client";
import {
  User,
  CommentSectionProps,
  Comment,
  CommentInsert,
  CommentFromDB,
} from "@/types/supabase";
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
  const supabase = createClient();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const now = new Date().toISOString();

    const newCommentData: CommentInsert = {
      content: newComment,
      postId,
      authorId: user.id,
      createdAt: now,
      updatedAt: now,
    };

    const { error } = await supabase.from("Comment").insert(newCommentData);

    if (error) {
      console.error("Error submitting comment:", error);
    } else {
      setNewComment("");
      fetchComments();
    }
  };

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from("Comment")
      .select(
        `
      id, content, createdAt, postId, authorId,
      User(id, name)
    `
      )
      .eq("postId", postId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
    } else if (data) {
      const transformedComments: Comment[] = (
        data as unknown as CommentFromDB[]
      ).map((comment) => ({
        ...comment,
        updatedAt: comment.createdAt,
        User: comment.User, // Just pass the User object directly
      }));
      setComments(transformedComments);
    }
  }, [supabase, postId]);
  const fetchUser = useCallback(async () => {
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (supabaseUser) {
      const user: User = {
        ...supabaseUser,
        user_metadata: supabaseUser.user_metadata || { name: undefined },
      };
      setUser(user);
    } else {
      setUser(null);
    }
  }, [supabase]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

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
      {comments.map((comment) => {
        if (!comment.User) return null;

        return (
          <div key={comment.id} className="mb-6 flex gap-4">
            <div className="h-11 w-11 flex-shrink-0 rounded-full outline outline-1 outline-black/20 bg-gray-200 text-black/20 flex items-center justify-center text-lg font-semibold">
              {comment.User.name
                ? comment.User.name.charAt(0).toUpperCase()
                : "AA"}
            </div>
            <div>
              <div className="flex items-center mb-2 gap-2">
                <span className="font-bold">
                  {comment.User.name?.split(" ")[0] || "Anonymous"}
                </span>
                <span className="text-sm text-gray-500">
                  {formatCommentTime(comment.createdAt)}
                </span>
              </div>
              <p>{comment.content}</p>
            </div>
          </div>
        );
      })}
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
