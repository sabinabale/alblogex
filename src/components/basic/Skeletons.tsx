import React from "react";

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function MyArticleTableSkeleton() {
  return (
    <div>
      <HeadingSkeleton />
      <TableSkeleton />
    </div>
  );
}

export function HeadingSkeleton() {
  return (
    <div className="flex mb-8">
      <div className={`h-8 w-52 rounded-md bg-gray-200 ${shimmer}`} />
      <div
        className={`ml-4 h-8 w-32 rounded-md bg-gray-200 text-sm font-medium ${shimmer}`}
      />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="relative rounded-md shadow-sm bg-white">
      <div className="border-b border-gray-100">
        <TableRowSkeleton />
      </div>
      <div className="border-b border-gray-100">
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
      </div>
      <div className="flex items-center truncate rounded-xl gap-4 px-4 py-3">
        <div className={`h-6 w-[120px] rounded-md bg-gray-100 ${shimmer}`} />
        <div className={`h-7 w-[90px] rounded-md bg-gray-100 ${shimmer}`} />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-center truncate rounded-xl gap-4 px-4 py-4">
      <div className={`h-6 w-9 rounded-md bg-gray-100 ${shimmer}`} />
      <div className={`h-6 w-2/5 rounded-md bg-gray-100 ${shimmer}`} />
      <div className={`h-6 w-2/5 rounded-md bg-gray-100 ${shimmer}`} />
      <div className={`h-6 w-1/4 rounded-md bg-gray-100 ${shimmer}`} />
      <div className={`h-6 w-1/6 rounded-md bg-gray-100 ${shimmer}`} />
      <div className={`h-6 w-1/6 rounded-md bg-gray-100 ${shimmer}`} />
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="flex mb-8">
      <div
        className={`w-[270px] h-[240px] bg-gray-200 rounded-md mr-8 ${shimmer}`}
      />
      <div className="flex flex-col gap-5 max-w-[560px]">
        <div className={`h-8 w-3/4 rounded-md bg-gray-200 ${shimmer}`} />
        <div className={`h-4 w-1/2 rounded-md bg-gray-200 ${shimmer}`} />
        <div className={`h-24 w-full rounded-md bg-gray-200 ${shimmer}`} />
        <div className="flex gap-4">
          <div className={`h-5 w-32 rounded-md bg-gray-200 ${shimmer}`} />
          <div className={`h-5 w-24 rounded-md bg-gray-200 ${shimmer}`} />
        </div>
      </div>
    </div>
  );
}

export function ArticleFullSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className={`h-10 w-3/4 rounded-md bg-gray-200 ${shimmer} mb-4`} />
      <div className={`h-4 w-1/2 rounded-md bg-gray-200 ${shimmer} mb-4`} />
      <div
        className={`w-[760px] h-[500px] rounded-md bg-gray-200 ${shimmer} mb-8`}
      />
      <div className={`h-48 w-full rounded-md bg-gray-200 ${shimmer} mb-8`} />
      <div className={`h-32 w-full rounded-md bg-gray-200 ${shimmer}`} />
    </div>
  );
}
