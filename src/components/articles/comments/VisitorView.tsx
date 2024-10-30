import React from "react";
import Link from "next/link";
import { Button } from "@/components/layout/Buttons";
import { User } from "@/types/supabase";

type VisitorViewProps = {
  user: User | null;
};

export default function VisitorView({ user }: VisitorViewProps) {
  if (user) return null;

  return (
    <div>
      <Button variant="link" size="none">
        <Link className="block mb-8 text-base" href="/signin">
          Sign in
        </Link>
      </Button>{" "}
      to add a comment 💬
    </div>
  );
}
