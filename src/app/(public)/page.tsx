import Image from "next/image";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { ArticleCardSkeleton } from "@/components/basic/Skeletons";
import { Post } from "@/types/types";

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
      <div className="flex flex-wrap gap-2">
        {posts.map((post) => (
          <Suspense key={post.id} fallback={<ArticleCardSkeleton />}>
            <div className="w-[32%] pr-2">
              <ArticleCard post={post} />
            </div>
          </Suspense>
        ))}
      </div>
    </div>
  );
}

const ArticleCard = ({ post }: { post: Post }) => {
  return (
    <Link href={`/articles/${post.id}`}>
      <article className="flex h-fit flex-col mb-8 border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:scale-[1.02] transition-all duration-[250ms] ease-in-out hover:shadow-lg">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={500}
            height={240}
            className="w-full h-[240px] rounded-t-md mr-4 object-cover"
            priority
          />
        ) : (
          <div className="w-[270px] h-[240px] bg-gray-200 rounded-md mr-8"></div>
        )}
        <div className="flex flex-col gap-4 p-6">
          <div className="text-sm text-gray-500">
            Written by {post.author.name}
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-black truncate">
              {post.title}
            </h2>

            <p className="h-[50px] line-clamp-2 overflow-hidden">
              {post.content.substring(0, 200)}
            </p>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}

            <div className="flex gap-1">
              {post.comments[0]?.count || 0}
              <span>comments</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};
