"use client";

import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState, useCallback } from "react";

import CommentSection from "@/components/CommentSection";
import { ArticleFullSkeleton } from "@/components/basic/Skeletons";
import { Post } from "@/types/types";

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: postData, error: postError } = await supabase
        .from("Post")
        .select(`*, author:User (name)`)
        .eq("id", params.id)
        .single();

      if (postError) {
        throw new Error(postError.message);
      }

      if (isPost(postData)) {
        setPost(postData);
      } else {
        throw new Error("Fetched data does not match Post type");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error fetching post:", err);
        setError(err.message);
      } else {
        console.error("Error fetching post:", err);
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, [params.id, supabase]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (isLoading) {
    return <ArticleFullSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="mb-4 text-sm">
        By {post.author.name} · {new Date(post.createdAt).toLocaleDateString()}
      </div>
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={760}
          height={500}
          className="w-[760px] h-[500px] rounded-md mb-8 object-cover object-top border border-gray-300/50"
          priority
        />
      )}
      <div className="prose max-w-none mb-8">{post.content}</div>
      <CommentSection postId={post.id} />
    </div>
  );
}

function isPost(obj: unknown): obj is Post {
  const post = obj as Post;
  return (
    typeof post.id === "number" &&
    typeof post.title === "string" &&
    typeof post.content === "string" &&
    (post.imageUrl === null || typeof post.imageUrl === "string") &&
    typeof post.createdAt === "string" &&
    post.author !== null &&
    typeof post.author.name === "string"
  );
}
