import TheForm, { LoginForm } from "@/components/TheForm";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <TheForm>
        <LoginForm />
      </TheForm>
      <small className="mt-8">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/register"
          className="text-cyan-500 font-semibold hover:text-cyan-700 transition-colors duration-200 ease-in-out"
        >
          Register
        </Link>
      </small>
    </div>
  );
}
