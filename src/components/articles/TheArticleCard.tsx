"use client";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/types/supabase";
import { useRef, useEffect, useState } from "react";
import FormattedDate from "../FormattedDate";

export default function ArticleCard({ post }: { post: Post }) {
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const [isParagraphClamped, setIsParagraphClamped] = useState(false);

  useEffect(() => {
    const checkH2Height = () => {
      if (h2Ref.current) {
        const h2Height = h2Ref.current.offsetHeight;
        setIsParagraphClamped(h2Height > 24);
      }
    };

    checkH2Height();
    window.addEventListener("resize", checkH2Height);

    return () => window.removeEventListener("resize", checkH2Height);
  }, []);

  return (
    <Link href={`/articles/${post.id}`}>
      <article className="flex h-[444px] flex-col mb-4 md:mb-8 border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:scale-[1.02] transition-all duration-[250ms] ease-in-out hover:shadow-lg">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={374}
            height={240}
            className="w-full h-[240px] rounded-t-md mr-4 object-cover overflow-hidden"
            priority
          />
        ) : (
          <div className="w-full h-[240px] bg-gray-200 rounded-t-md mr-8"></div>
        )}

        <div className="flex flex-col gap-4 p-6">
          <div className="text-sm text-gray-500">
            Written by {post.author.name.split(" ")[0]}
          </div>
          <div className="flex flex-col gap-1">
            <h2
              ref={h2Ref}
              className="text-xl leading-6 font-semibold text-black line-clamp-2"
            >
              {post.title.length > 60
                ? `${post.title.substring(0, 57)}...`
                : post.title}
            </h2>

            <p
              className={`overflow-hidden ${
                isParagraphClamped ? "line-clamp-1" : "line-clamp-2"
              }`}
            >
              {removeMarkdown(post.content.substring(0, 200))}
            </p>
          </div>
          <div className="flex gap-2 text-sm text-gray-500 mt-auto">
            <FormattedDate date={post.createdAt} />
            <span>·</span>
            <div className="flex gap-1">
              {!post.comments[0]?.count ? (
                "no comments yet"
              ) : (
                <>
                  {post.comments[0].count}
                  <span>
                    {post.comments[0].count === 1 ? "comment" : "comments"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function removeMarkdown(text: string): string {
  // Remove bold and italic markers
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");

  // Remove links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

  // Remove code blocks
  text = text.replace(/`{3}[\s\S]*?`{3}/g, "");
  text = text.replace(/`([^`]+)`/g, "$1");

  // Remove headers
  text = text.replace(/^#{1,6}\s+/gm, "");

  // Remove blockquotes
  text = text.replace(/^>\s+/gm, "");

  // Remove horizontal rules
  text = text.replace(/^(?:[-*_]){3,}$/gm, "");

  // Remove list markers
  text = text.replace(/^[\s*-+]+/gm, "");

  return text.trim();
}
