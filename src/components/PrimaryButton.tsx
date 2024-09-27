import React from "react";

export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-black/90 font-medium text-white text-sm px-3 py-1.5 rounded-md w-fit">
      {children}
    </button>
  );
}
