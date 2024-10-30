import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/supabase-client";
import {
  Comment,
  CommentInsert,
  CommentFromDB,
  User,
} from "@/lib/types/supabase";

export const useComments = (postId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const supabase = createClient();

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
      return;
    }

    if (data) {
      const transformedComments: Comment[] = (
        data as unknown as CommentFromDB[]
      ).map((comment) => ({
        ...comment,
        updatedAt: comment.createdAt,
        User: comment.User,
      }));
      setComments(transformedComments);
    }
  }, [postId, supabase]);

  const addComment = async (content: string, user: User) => {
    const now = new Date().toISOString();
    const newCommentData: CommentInsert = {
      content,
      postId,
      authorId: user.id,
      createdAt: now,
      updatedAt: now,
    };

    const { error } = await supabase.from("Comment").insert(newCommentData);

    if (error) {
      console.error("Error submitting comment:", error);
      return false;
    }

    await fetchComments();
    return true;
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, addComment, fetchComments };
};
