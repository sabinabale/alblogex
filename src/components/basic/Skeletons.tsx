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
    <div className="border border-gray-300 rounded-xl text-sm bg-white shadow-sm w-full overflow-hidden">
      <table className="w-full table-fixed">
        <thead>
          <TableRowSkeleton />
        </thead>
        <tbody>
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </tbody>
        <tfoot>
          <tr>
            <td className="py-2 pl-3">
              <div className={`h-5 w-32 rounded-md bg-gray-100 ${shimmer}`} />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-300">
      <td className="pl-3 pr-4 w-4">
        <div
          className={`h-[18px] w-[18px] rounded-md bg-gray-100 ${shimmer}`}
        />
      </td>
      <td className="py-2 px-4 w-1/3">
        <div className={`h-5 w-full rounded-md bg-gray-100 ${shimmer}`} />
      </td>
      <td className="py-2 px-4 w-2/3">
        <div className={`h-5 w-full rounded-md bg-gray-100 ${shimmer}`} />
      </td>
      <td className="py-2 px-4 w-1/4">
        <div className={`h-5 w-full rounded-md bg-gray-100 ${shimmer}`} />
      </td>
      <td className="py-2 px-4 w-1/5">
        <div className={`h-5 w-full rounded-md bg-gray-100 ${shimmer}`} />
      </td>
      <td className="py-2 px-4 w-1/5">
        <div className={`h-5 w-full rounded-md bg-gray-100 ${shimmer}`} />
      </td>
    </tr>
  );
}

export function RecentArticleSkeleton() {
  return (
    <div className="flex flex-wrap gap-4">
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="flex-1 min-w-0 basis-[calc(33.333%-1rem)] h-[444px] flex-col mb-8 border border-gray-200 rounded-xl bg-white overflow-hidden">
      <div className={`w-full h-[240px] bg-gray-200 ${shimmer}`} />
      <div className="flex flex-col gap-4 p-6">
        <div className={`h-5 w-1/3 rounded-md bg-gray-200 ${shimmer}`} />
        <div className="flex flex-col gap-1">
          <div className={`h-6 w-5/6 rounded-md bg-gray-200 ${shimmer}`} />
          <div className={`${shimmer} flex flex-col gap-2`}>
            <div className={`h-12 w-full rounded-md bg-gray-200`} />
          </div>
        </div>
        <div className="flex gap-2">
          <div className={`h-5 w-1/4 rounded-md bg-gray-200 ${shimmer}`} />
          <div className={`h-5 w-[30%] rounded-md bg-gray-200 ${shimmer}`} />
        </div>
      </div>
    </div>
  );
}

export function ArticleFullSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className={`h-5 w-1/4 rounded-md bg-gray-200 ${shimmer} mb-4`} />
      <div
        className={`w-[760px] h-[400px] rounded-xl bg-gray-200 ${shimmer} mb-8`}
      />
      <div className={`h-10 w-3/4 rounded-md bg-gray-200 ${shimmer} mb-4`} />
      <div className={`h-4 w-1/2 rounded-md bg-gray-200 ${shimmer} mb-8`} />
      <div className={`h-32 w-full rounded-md bg-gray-200 ${shimmer} mb-5`} />
      <div className={`h-32 w-full rounded-md bg-gray-200 ${shimmer} mb-5`} />
      <div className={`h-32 w-full rounded-md bg-gray-200 ${shimmer}`} />
    </div>
  );
}
