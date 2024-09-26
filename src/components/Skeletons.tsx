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
      <div className={`h-6 w-8 rounded-md bg-gray-100 ${shimmer}`} />
      <div className={`h-6 w-2/5 rounded-md bg-gray-100 ${shimmer}`} />
      <div className={`h-6 w-2/5 rounded-md bg-gray-100 ${shimmer}`} />
      <div className={`h-6 w-1/4 rounded-md bg-gray-100 ${shimmer}`} />
      <div className={`h-6 w-1/6 rounded-md bg-gray-100 ${shimmer}`} />
      <div className={`h-6 w-1/6 rounded-md bg-gray-100 ${shimmer}`} />
    </div>
  );
}
