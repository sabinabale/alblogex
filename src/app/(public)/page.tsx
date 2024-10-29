import { createServer } from "@/lib/supabase-server";
import { queries } from "@/lib/supabase-shared-queries";
import { Suspense } from "react";
import { RecentArticleSkeleton } from "@/components/layout/Skeletons";
import { Post } from "@/types/supabase";
import TheArticleCard from "@/components/articles/TheArticleCard";

function isValidPost(post: unknown): post is Post {
  const p = post as Post;
  return (
    typeof p.id === "number" &&
    typeof p.title === "string" &&
    typeof p.content === "string" &&
    (p.imageUrl === null || typeof p.imageUrl === "string") &&
    typeof p.createdAt === "string" &&
    p.author !== null &&
    typeof p.author.name === "string" &&
    Array.isArray(p.comments) &&
    p.comments.every((c) => typeof c.count === "number")
  );
}

export default async function Home() {
  const supabase = createServer();

  const { data, error } = await queries.getRecentPosts(supabase);

  if (error) {
    console.error("Error fetching posts:", error);
    return <div>Error loading recent articles</div>;
  }

  const posts = (data || []).filter(isValidPost);

  return (
    <div className="min-h-screen">
      <h1 className="mb-8">Recent articles</h1>
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        <Suspense fallback={<RecentArticleSkeleton />}>
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex-1 min-w-0 basis-[calc(50%-0.5rem)] md:basis-[calc(33.333%-1rem)] w-full"
            >
              <TheArticleCard post={post} />
            </div>
          ))}
        </Suspense>
      </div>
    </div>
  );
}
