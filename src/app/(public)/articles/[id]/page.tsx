"use client";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ArrowIcon from "@/assets/icons/backarrow.svg";
import CommentSection from "@/components/articles/comments/CommentSection";
import { ArticleFullSkeleton } from "@/components/layout/Skeletons";
import type { PostWithAuthorAndComments } from "@/lib/supabase/supabase-shared-queries";
import { useFetchPost } from "@/lib/hooks/useFetchPost";
import FormattedDate from "@/components/FormattedDate";

function ReturnToArticles() {
  return (
    <Link href="/" className="flex gap-2 items-center text-sm my-4">
      <Image src={ArrowIcon} width={16} height={16} alt="go back icon" />
      Back to recent articles
    </Link>
  );
}

function ArticleHeader({ post }: { post: PostWithAuthorAndComments }) {
  return (
    <header>
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
      <h1 className="article-heading mb-4">{post.title}</h1>
      <div className="flex gap-2 text-sm text-gray-500 my-4">
        <FormattedDate date={post.createdAt} />
        <span>·</span>
        <div>Written by {post.author.name.split(" ")[0]}</div>
      </div>
    </header>
  );
}

function ArticleContent({ content }: { content: string }) {
  return (
    <div className="prose max-w-none my-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const { post, isLoading, error } = useFetchPost(params.id);

  if (isLoading) return <ArticleFullSkeleton />;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <ReturnToArticles />
      <ArticleHeader post={post} />
      <ArticleContent content={post.content} />
      <CommentSection postId={post.id} />
    </div>
  );
}
