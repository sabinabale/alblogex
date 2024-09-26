import React from "react";

const ShimmerEffect = () => (
  <div className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-full w-full rounded"></div>
);

export function MyArticleTableSkeleton() {
  return (
    <div className="border border-gray-300 rounded-md bg-white">
      {/* Header */}
      <div className="grid grid-cols-[auto,290px,290px,200px,1fr,1fr] gap-4 items-center border-b border-gray-300 px-4 py-4">
        <div className="w-6 h-6">
          <ShimmerEffect />
        </div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-6">
            <ShimmerEffect />
          </div>
        ))}
      </div>

      {[...Array(5)].map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-[auto,290px,290px,200px,1fr,1fr] gap-4 items-center px-4 py-2 border-b border-gray-200"
        >
          <div className="w-6 h-6">
            <ShimmerEffect />
          </div>
          {[...Array(4)].map((_, colIndex) => (
            <div key={colIndex} className="h-6">
              <ShimmerEffect />
            </div>
          ))}
          <div className="flex space-x-4">
            <div className="w-6 h-6">
              <ShimmerEffect />
            </div>
            <div className="w-6 h-6">
              <ShimmerEffect />
            </div>
          </div>
        </div>
      ))}

      <div className="py-2 px-4 flex gap-4 border-t text-sm border-gray-300 items-center">
        <div className="w-[120px] h-6">
          <ShimmerEffect />
        </div>
        <div className="w-24 h-8">
          <ShimmerEffect />
        </div>
      </div>
    </div>
  );
}
