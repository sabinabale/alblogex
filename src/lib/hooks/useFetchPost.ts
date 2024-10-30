import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/supabase-client";
import { queries } from "@/lib/supabase/supabase-shared-queries";
import type { PostWithAuthorAndComments } from "@/lib/supabase/supabase-shared-queries";

type PostState = {
  post: PostWithAuthorAndComments | null;
  isLoading: boolean;
  error: string | null;
};

function isValidPost(data: unknown): data is PostWithAuthorAndComments {
  const post = data as PostWithAuthorAndComments;
  return (
    typeof post?.id === "number" &&
    typeof post?.title === "string" &&
    typeof post?.content === "string" &&
    (post?.imageUrl === null || typeof post?.imageUrl === "string") &&
    typeof post?.createdAt === "string" &&
    typeof post?.author?.name === "string" &&
    Array.isArray(post?.comments) &&
    post?.comments.every((c) => typeof c?.count === "number")
  );
}

export function useFetchPost(postId: string) {
  const [state, setState] = useState<PostState>({
    post: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const supabase = createClient();

    async function fetchPost() {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const { data, error } = await queries.getFullPost(supabase, postId);

        if (error) throw new Error(error.message);
        if (!data) throw new Error("Post not found");
        if (!isValidPost(data)) throw new Error("Invalid post data");

        setState({ post: data, isLoading: false, error: null });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            err instanceof Error ? err.message : "An unknown error occurred",
        }));
      }
    }

    fetchPost();
  }, [postId]);

  return state;
}
