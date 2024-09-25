import Image from "next/image";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const revalidate = 60; // revalidate this page every 60 seconds

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  User: {
    name: string;
  };
  Comment: {
    count: number;
  }[];
}

interface RawPost {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  User: {
    name: string;
  } | null;
  Comment:
    | {
        count: number;
      }[]
    | null;
}

function isPost(obj: unknown): obj is Post {
  const post = obj as RawPost;
  return (
    typeof post.id === "number" &&
    typeof post.title === "string" &&
    typeof post.content === "string" &&
    (post.imageUrl === null || typeof post.imageUrl === "string") &&
    typeof post.createdAt === "string" &&
    post.User !== null &&
    typeof post.User.name === "string" &&
    Array.isArray(post.Comment) &&
    post.Comment.every((c) => typeof c.count === "number")
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
      User (name),
      Comment (count)
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
        <ArticleCard key={post.id} post={post} />
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
          width={272}
          height={244}
          className="rounded-md mr-8 object-cover"
        />
      ) : (
        <div className="w-[272px] h-[244px] bg-gray-200 rounded-md mr-8"></div>
      )}
      <div className="flex flex-col gap-4 max-w-[560px]">
        <h2 className="text-2xl font-semibold text-black">{post.title}</h2>
        <div className="text-sm">
          {post.User.name} · {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <p className="text-balance">{post.content.substring(0, 200)}...</p>
        <div className="flex gap-4 text-sm">
          <Link
            className="text-cyan-600 underline underline-offset-2 hover:text-cyan-500"
            href={`/articles/${post.id}`}
          >
            Read whole article
          </Link>
          <div>{post.Comment[0]?.count || 0} comments</div>
        </div>
      </div>
    </article>
  );
};
