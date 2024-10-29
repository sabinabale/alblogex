import Link from "next/link";
import React from "react";
import TheRegistrationForm from "@/components/auth/TheRegistrationForm";

export default function Page() {
  return (
    <div className="flex flex-col items-center mt-16 mb-16 md:mb-0 lg:mt-20 h-full">
      <h1 className="mb-8 tracking-tight">Sign up</h1>
      <TheRegistrationForm />
      <small className="mt-8 text-gray-600">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-cyan-600 font-semibold underline underline-offset-1 hover:text-cyan-800 transition-colors duration-200 ease-in-out"
        >
          Sign in here
        </Link>
      </small>
    </div>
  );
}
