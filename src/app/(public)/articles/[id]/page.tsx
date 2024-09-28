"use client";

import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ArrowIcon from "@/assets/icons/backarrow.svg";
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
      <Link href="/" className="flex gap-2 items-center text-sm my-4">
        <Image src={ArrowIcon} width={16} height={16} alt="go back icon" /> Back
        to recent articles
      </Link>
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={760}
          height={400}
          className="w-[760px] h-[400px] rounded-2xl mb-8 object-cover border border-gray-300/50"
          priority
        />
      )}

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex gap-2 text-sm text-gray-500 my-4">
        {new Date(post.createdAt)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, ".")}
        <span>·</span>
        <div className="flex gap-1">
          Written by {post.author.name.split(" ")[0]}
        </div>
      </div>
      <div className="prose max-w-none my-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
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
