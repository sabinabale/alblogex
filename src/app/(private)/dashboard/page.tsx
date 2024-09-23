"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MyArticleTable from "../../../components/MyArticleTable";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const response = await fetch("/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Token verification failed");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error("Token verification error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [router]);

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
          {user?.name ? `${user.name}'s` : "My"} articles
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
