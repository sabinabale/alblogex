"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { NavLinkProps } from "@/types/types";
import { Button } from "./basic/Buttons";
import catIcon from "@/assets/icons/caticon.svg";
import Image from "next/image";

export default function TheNavbar() {
  const pathname = usePathname();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsSignedIn(!!session);
    };

    checkAuthStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const NavLink = ({ href, children }: NavLinkProps) => (
    <Link
      href={href}
      className={`py-1.5 px-2 font-semibold ${
        pathname === href ? "text-black" : "text-black/50 hover:text-black"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <div className="border-b border-gray-300 bg-white font-medium">
      <nav className="flex max-w-6xl mx-auto justify-between items-center py-2 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image src={catIcon} alt="cat icon" />
          </Link>
          <NavLink href="/">Recent articles</NavLink>
        </div>
        <div className="space-x-2">
          {isSignedIn ? (
            <>
              <NavLink href="/app/dashboard">My articles</NavLink>
              <Link
                className="bg-black text-white hover:bg-[#333333] rounded-md px-4 py-1.5 h-8"
                href="/app/create-article"
              >
                Create article
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 w-auto h-[32px] font-semibold text-red-600 rounded-md hover:text-red-400 transition-colors duration-200 ease-in-out"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <NavLink href="/signin">Sign in</NavLink>
              <Button variant="primary" size="default">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
