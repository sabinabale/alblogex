// import Image from "next/image";
// import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { ArticleCardSkeleton } from "@/components/basic/Skeletons";
import { Post } from "@/types/types";
import TheArticleCard from "@/components/TheArticleCard";

function isPost(obj: unknown): obj is Post {
  const post = obj as Post;
  return (
    typeof post.id === "number" &&
    typeof post.title === "string" &&
    typeof post.content === "string" &&
    (post.imageUrl === null || typeof post.imageUrl === "string") &&
    typeof post.createdAt === "string" &&
    post.author !== null &&
    typeof post.author.name === "string" &&
    Array.isArray(post.comments) &&
    post.comments.every((c) => typeof c.count === "number")
  );
}

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from("Post")
    .select(
      `
      id,
      title,
      content,
      imageUrl,
      createdAt,
      author:User (name),
      comments:Comment (count)
    `
    )
    .order("createdAt", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching posts:", error);
    return <div>Error loading recent articles</div>;
  }

  const posts = (data as unknown[]).filter(isPost);

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Recent articles</h1>
      <div className="flex flex-wrap gap-4">
        {posts.slice(0, 3).map((post) => (
          <Suspense key={post.id} fallback={<ArticleCardSkeleton />}>
            <div className="flex-1 min-w-0 basis-[calc(33.333%-1rem)]">
              <TheArticleCard post={post} />
            </div>
          </Suspense>
        ))}
      </div>
    </div>
  );
}
