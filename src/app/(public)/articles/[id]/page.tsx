"use client";

import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CommentSection from "@/components/TheCommentSection";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  User: { name: string };
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: { name: string };
  upvotes: number;
  downvotes: number;
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [initialComments, setInitialComments] = useState<Comment[]>([]);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const fetchPostAndComments = useCallback(async () => {
    const { data: postData, error: postError } = await supabase
      .from("Post")
      .select(`*, User (name)`)
      .eq("id", params.id)
      .single();

    if (postError) {
      console.error("Error fetching post:", postError);
      router.push("/404");
      return;
    }

    setPost(postData as Post);

    const { data: commentsData, error: commentsError } = await supabase
      .from("Comment")
      .select(`*, author:User (name)`)
      .eq("postId", params.id)
      .order("createdAt", { ascending: false });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
    } else {
      setInitialComments((commentsData as Comment[]) || []);
    }
  }, [params.id, supabase, router]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="mb-4 text-sm">
        By {post.User.name} · {new Date(post.createdAt).toLocaleDateString()}
      </div>
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={800}
          height={400}
          className="rounded-lg mb-8 object-cover"
        />
      )}
      <div className="prose max-w-none mb-8">{post.content}</div>

      <CommentSection postId={params.id} initialComments={initialComments} />
    </div>
  );
}
