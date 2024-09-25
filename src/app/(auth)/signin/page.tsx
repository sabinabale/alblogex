"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TheSigninForm from "../../../components/TheSigninForm";
import Link from "next/link";

export default function SigninPage() {
  const router = useRouter();

  const handleSuccessfulLogin = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center mt-40 h-screen">
      <h1 className="text-2xl font-bold mb-8">Sign in</h1>
      <TheSigninForm onSuccessfulLogin={handleSuccessfulLogin} />
      <small className="mt-8">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/signup"
          className="text-cyan-600 font-semibold underline underline-offset-1 hover:text-cyan-800 transition-colors duration-200 ease-in-out"
        >
          Sign up here
        </Link>
      </small>
    </div>
  );
}
