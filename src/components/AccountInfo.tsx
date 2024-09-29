import React from "react";
import { Button } from "@/components/basic/Buttons";
import logOut from "@/assets/icons/logout.svg";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@/types/types";

interface AccountInfoProps {
  user: User | null;
}

export default function AccountInfo({ user }: AccountInfoProps) {
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg w-fit text-sm overflow-hidden shadow-md">
      <div className="border-b border-gray-300 p-3 space-y-0.5 bg-gray-100">
        <div className="font-medium text-black">
          {user?.user_metadata?.name || "Why would you"}
        </div>
        <div className="text-gray-500 text-[13px] font-medium pr-[30px]">
          {user?.email}
        </div>
      </div>
      <div className="bg-white py-2 px-3 flex items-center">
        <Button variant="destructive" size="none" onClick={handleLogout}>
          <Image src={logOut} width={20} height={20} alt="Log out" />
          <span className="ml-1">Log out</span>
        </Button>
      </div>
    </div>
  );
}
