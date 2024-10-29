import React from "react";

export default function TheContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto mt-8 md:mt-16 px-5 w-full">
      {children}
    </div>
  );
}
