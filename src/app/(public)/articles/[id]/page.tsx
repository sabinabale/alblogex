"use client";

import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import CommentSection from "@/components/CommentSection";
import { ArticleFullSkeleton } from "@/components/Skeletons";
import { Post } from "@/types/types";

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const fetchPost = useCallback(async () => {
    const { data: postData, error: postError } = await supabase
      .from("Post")
      .select(`*, author:User (name)`)
      .eq("id", params.id)
      .single();

    if (postError) {
      console.error("Error fetching post:", postError);
      router.push("/404");
      return;
    }

    if (isPost(postData)) {
      setPost(postData);
    } else {
      console.error("Fetched data does not match Post type");
      router.push("/404");
    }
  }, [params.id, supabase, router]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return (
    <>
      <Suspense fallback={<ArticleFullSkeleton />}>
        <div className="max-w-3xl mx-auto py-8">
          {post && (
            <>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="mb-4 text-sm">
                By {post.author.name} ·{" "}
                {new Date(post.createdAt).toLocaleDateString()}
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
            </>
          )}
        </div>
      </Suspense>
    </>
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
