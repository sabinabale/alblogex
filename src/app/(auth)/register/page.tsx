import TheRegistrationForm from "@/components/TheRegistrationForm";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <TheRegistrationForm />
      <small className="mt-8">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-cyan-500 font-semibold hover:text-cyan-700 transition-colors duration-200 ease-in-out"
        >
          Login
        </Link>
      </small>
    </div>
  );
}
