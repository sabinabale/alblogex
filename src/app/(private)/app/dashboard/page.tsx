"use client";

import MyArticleTable from "@/components/articles/MyArticleTable";
import { MyArticleTableSkeleton } from "@/components/layout/Skeletons";
import useDashboardData from "@/lib/hooks/useDashboardData";

function UserGreeting({ userName }: { userName?: string }) {
  const displayName = userName ? `${userName.split(" ")[0]}'s` : "My";
  return <h1>{displayName} articles</h1>;
}

export default function Dashboard() {
  const { user, articles, isLoading, error, setArticles } = useDashboardData();

  if (isLoading) {
    return <MyArticleTableSkeleton />;
  }

  if (error) {
    return <p>Error loading dashboard: {error}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <UserGreeting userName={user?.user_metadata?.name} />
      </div>
      <MyArticleTable
        initialArticles={articles}
        onArticlesChange={setArticles}
      />
    </div>
  );
}
