import Image from "next/image";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { ArticleCardSkeleton } from "@/components/Skeletons";
import { Post } from "@/types/types";

export const revalidate = 60;

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
      {posts.map((post) => (
        <Suspense key={post.id} fallback={<ArticleCardSkeleton />}>
          <ArticleCard post={post} />
        </Suspense>
      ))}
    </div>
  );
}

const ArticleCard = ({ post }: { post: Post }) => {
  return (
    <article className="flex mb-8">
      {post.imageUrl ? (
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={270}
          height={240}
          className="w-[270px] h-[240px] rounded-md mr-8 object-cover"
          priority
        />
      ) : (
        <div className="w-[270px] h-[240px] bg-gray-200 rounded-md mr-8"></div>
      )}
      <div className="flex flex-col gap-4 max-w-[560px]">
        <h2 className="text-2xl font-semibold text-black">{post.title}</h2>
        <div className="text-sm">
          {post.author.name} · {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <p className="text-balance">{post.content.substring(0, 200)}...</p>
        <div className="flex gap-4 text-sm">
          <Link
            className="text-cyan-600 underline underline-offset-2 hover:text-cyan-500"
            href={`/articles/${post.id}`}
          >
            Read whole article
          </Link>
          <div>{post.comments[0]?.count || 0} comments</div>
        </div>
      </div>
    </article>
  );
};
