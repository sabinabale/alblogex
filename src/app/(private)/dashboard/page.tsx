"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MyArticleTable from "../../../components/MyArticleTable";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/auth-helpers-nextjs";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        if (user) {
          setUser(user);
        } else {
          router.push("/signin");
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router, supabase.auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Authentication Error</h1>
        <p>{error}</p>
        <button onClick={() => router.push("/signin")}>
          Return to Sign In
        </button>
      </div>
    );
  }

  if (!user) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-semibold">
          {user.user_metadata.name ? `${user.user_metadata.name}'s` : "My"}{" "}
          articles
        </h1>
        <Link
          href="/create-article"
          className="w-fit py-1.5 px-3 text-sm bg-black text-white rounded-lg"
        >
          Create article
        </Link>
      </div>
      <MyArticleTable />
    </div>
  );
}
