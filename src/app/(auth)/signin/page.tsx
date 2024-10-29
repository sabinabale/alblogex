"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TheSigninForm from "@/components/auth/TheSignInForm";

export default function SigninPage() {
  const router = useRouter();

  const handleSuccessfulLogin = () => {
    router.push("/app/dashboard");
  };

  return (
    <div className="flex flex-col items-center mt-16 mb-16 md:mb-0 lg:mt-40 h-full">
      <h1 className="mb-8 tracking-tight">Sign in</h1>
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
