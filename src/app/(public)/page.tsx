import Image from "next/image";
import Link from "next/link";
import catblackwhite from "@/assets/images/catblackwhite.png";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Recent articles</h1>
      <Suspense fallback={<ArticleCardSkeleton />}>
        <ArticleCard />
      </Suspense>
    </div>
  );
}

const ArticleCard = () => {
  return (
    <article className="flex">
      <Image
        src={catblackwhite}
        alt="Cat"
        width={272}
        height={244}
        className="rounded-md mr-8"
      />
      <div className="flex flex-col gap-4 max-w-[560px]">
        <h2 className="text-2xl font-semibold text-black">
          Why do cats have whiskers?
        </h2>
        <div className="text-sm">Elisabeth Strain · 2024/02/14</div>
        <p className="text-balance">
          A cat&apos;s whiskers — or vibrissae — are a well-honed sensory tool
          that helps a cat see in the dark and steer clear of hungry predators.
          Whiskers are highly sensitive tactile hairs that grow in patterns on a
          cat&apos;s muzzle, above its eyes and elsewhere on its body, like the
          ears, jaw and forelegs.
        </p>
        <div className="flex gap-4 text-sm">
          <Link
            className="text-cyan-600 underline underline-offset-2 hover:text-cyan-500"
            href="/article/1"
          >
            Read whole article
          </Link>
          <div>4 comments</div>
        </div>
      </div>
    </article>
  );
};

const ArticleCardSkeleton = () => {
  return (
    <article className="flex animate-pulse">
      <div className="w-[272px] h-[244px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md mr-8"></div>

      <div className="flex flex-col gap-4 w-full max-w-[560px]">
        <div className="h-[32px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"></div>
        <div className="h-[20px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"></div>
        <div className="h-[100px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"></div>
        <div className="flex gap-4 text-sm">
          <div className="h-[20px] w-[130px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"></div>
          <div className="h-[20px] w-[130px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md"></div>
        </div>
      </div>
    </article>
  );
};
