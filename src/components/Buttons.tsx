import React from "react";

export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-black text-white rounded-[8px] px-4 h-[32px]">
      {children}
    </button>
  );
}
