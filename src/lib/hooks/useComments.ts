import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-client";
import { User } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

type DbComment = Database["public"]["Tables"]["Comment"]["Row"] & {
  author: Pick<Database["public"]["Tables"]["User"]["Row"], "id" | "name">[];
};

type CommentWithAuthor = Omit<DbComment, "author"> & {
  author: Pick<Database["public"]["Tables"]["User"]["Row"], "id" | "name">;
};

export function useComments(postId: number) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("Comment")
        .select(
          `
          id,
          content,
          postId,
          authorId,
          createdAt,
          updatedAt,
          author:User (
            id,
            name
          )
        `
        )
        .eq("postId", postId)
        .order("createdAt", { ascending: false });

      if (error) throw error;

      const transformedComments: CommentWithAuthor[] = (data || []).map(
        (comment: DbComment) => ({
          ...comment,
          author: comment.author[0],
        })
      );

      setComments(transformedComments);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching comments");
    } finally {
      setIsLoading(false);
    }
  }, [supabase, postId]);

  const fetchUser = useCallback(async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(user);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err.message : "Error fetching user");
    }
  }, [supabase]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSetNewComment = (comment: string) => {
    setNewComment(comment);
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);

      const now = new Date().toISOString();
      const { error } = await supabase.from("Comment").insert({
        content: newComment,
        postId,
        authorId: user.id,
        createdAt: now,
        updatedAt: now,
      } satisfies Partial<Database["public"]["Tables"]["Comment"]["Insert"]>);

      if (error) throw error;

      setNewComment("");
      setError(null);
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error submitting comment");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCommentTime = (timestamp: string) => {
    try {
      const localDate = dayjs.utc(timestamp).tz(dayjs.tz.guess());
      return localDate.fromNow();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "a few seconds ago";
    }
  };

  return {
    comments,
    user,
    newComment,
    isLoading,
    error,
    setNewComment: handleSetNewComment,
    submitComment,
    formatCommentTime,
  } as const;
}
