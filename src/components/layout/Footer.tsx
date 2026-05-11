import React from "react";

export default function Footer() {
  return (
    <footer className="mt-auto pt-5 mb-4 w-full max-w-6xl mx-auto px-5">
      <div className="flex md:flex-row flex-col justify-between items-center text-center">
        <small className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Sabina Masar 👩🏼‍💻
        </small>
        <small>
          This footer is a little boring but the page would be sad without it
          🏝️.
        </small>
      </div>
    </footer>
  );
}
