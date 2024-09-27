import React from "react";

export default function TheForm({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-xl p-8 shadow-sm bg-white">
      {children}
    </div>
  );
}
