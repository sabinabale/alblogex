import Link from "next/link";
import React from "react";
import TheRegistrationForm from "../../../components/TheRegistrationForm";

export default function Page() {
  return (
    <div className="flex flex-col items-center mt-40 h-screen">
      <h1 className="text-2xl font-bold mb-8 tracking-tight">Sign up</h1>
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
