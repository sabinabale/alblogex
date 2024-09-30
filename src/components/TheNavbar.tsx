"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { NavLinkProps } from "@/types/types";
import { Button } from "@/components/basic/Buttons";
import catIcon from "@/assets/icons/caticon.svg";
import Image from "next/image";
import WriteIcon from "@/assets/icons/write.svg";
import type { User } from "@/types/types";
import ChevronDown from "@/assets/icons/chevrondown.svg";
import AccountInfo from "@/components/AccountInfo";

export default function TheNavbar() {
  const pathname = usePathname();

  const [isSignedIn, setIsSignedIn] = useState(false);
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const accountInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsSignedIn(!!session);
      if (session) {
        setUser(session.user);
      }
    };

    checkAuthStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session);
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountInfoRef.current &&
        !accountInfoRef.current.contains(event.target as Node)
      ) {
        setShowAccountInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setShowAccountInfo(false);
  }, [pathname]);

  const NavLink = ({ href, children }: NavLinkProps) => (
    <Link
      href={href}
      className={`py-1.5 px-2 font-semibold flex-shrink-0 ${
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
        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <NavLink href="/app/dashboard">My articles</NavLink>
              <Link
                className="bg-black flex-shrink-0 text-white hover:bg-[#333333] rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2"
                href="/app/create-article"
              >
                <Image src={WriteIcon} alt="Write article" />
                <span>Write article</span>
              </Link>
              <span className="mx-2 opacity-20">|</span>
              <div className="relative" ref={accountInfoRef}>
                <button
                  className="flex items-center justify-center group hover:scale-105 transition-all duration-300"
                  onClick={() => setShowAccountInfo(!showAccountInfo)}
                >
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 text-black flex items-center justify-center font-bold group-hover:bg-black group-hover:text-white transition-all duration-500 ease-in-out">
                    {user?.user_metadata?.name
                      ? user.user_metadata.name.charAt(0).toUpperCase()
                      : "AA"}
                  </div>
                  <Image src={ChevronDown} alt="Open account menu" />
                </button>
                {showAccountInfo && (
                  <div className="absolute right-0 mt-1">
                    <AccountInfo user={user} />
                  </div>
                )}
              </div>
            </div>
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
