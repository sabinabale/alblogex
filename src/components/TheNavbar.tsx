"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function TheNavbar() {
  const router = useRouter();
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
    router.push("/");
  };

  const getLinkClassName = (href: string) => {
    const baseClasses =
      "px-3 py-1.5 font-medium rounded-lg transition-colors duration-200 ease-in-out";
    const activeClasses = "text-black font-semibold";
    const hoverClasses = "hover:text-black hover:font-semibold";

    return `${baseClasses} ${pathname === href ? activeClasses : hoverClasses}`;
  };

  return (
    <div className="border-b border-gray-300 bg-white font-medium">
      <nav className="flex max-w-6xl mx-auto justify-between items-center py-2 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6.5L17.4448 8.98386C16.6121 8.97828 15.7463 9.08581 14.8767 9.3188C14.0072 9.55178 13.2037 9.89153 12.4854 10.3127L8.23926 9.32674L9.11761 14.1907C8.79389 15.135 8.73348 16.1269 8.99221 17.0925C9.29987 18.2407 10.0169 19.1954 11 19.8962M5 20H19C19.5523 20 20 19.5523 20 19V5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20Z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinejoin="round"
              />
              <path
                d="M13.9897 14.4899C14.1731 15.1742 13.8594 15.8527 13.2892 16.0055C12.719 16.1583 12.1081 15.7275 11.9248 15.0432C11.7414 14.359 12.0551 13.6804 12.6253 13.5276C13.1955 13.3748 13.8064 13.8057 13.9897 14.4899Z"
                fill="currentColor"
              />
              <path
                d="M20.1841 12.83C20.3674 13.5143 20.0538 14.1928 19.4836 14.3456C18.9134 14.4984 18.3025 14.0676 18.1191 13.3833C17.9358 12.699 18.2494 12.0205 18.8196 11.8677C19.3898 11.7149 20.0007 12.1458 20.1841 12.83Z"
                fill="currentColor"
              />
              <path
                d="M18.0684 16.4955C18.1906 16.9516 17.735 17.4701 17.0508 17.6534C16.3665 17.8367 15.7127 17.6156 15.5905 17.1594C15.4683 16.7032 15.9239 16.1848 16.6081 16.0015C17.2924 15.8181 17.9462 16.0393 18.0684 16.4955Z"
                fill="currentColor"
              />
            </svg>
          </Link>
          <Link
            className={`flex items-center space-x-2 px-3 h-[32px] rounded-lg transition-colors duration-200 ease-in-out ${
              pathname === "/"
                ? "text-black font-semibold"
                : "text-gray-600 hover:text-black hover:font-semibold"
            }`}
            href="/"
          >
            Recent articles
          </Link>
        </div>
        <div className="space-x-2">
          {isSignedIn ? (
            <>
              <Link
                className={getLinkClassName("/dashboard")}
                href="/app/dashboard"
              >
                My articles
              </Link>
              <Link
                className="bg-black text-white hover:bg-[#333333] rounded-lg px-4 py-1.5 h-8"
                href="/app/create-article"
              >
                Create article
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 w-auto h-[32px] font-semibold text-red-600 rounded-lg hover:text-red-400 transition-colors duration-200 ease-in-out"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className={getLinkClassName("/signin")} href="/signin">
                Sign in
              </Link>
              <Link
                className="px-3 py-1.5 h-[32px] bg-black font-semibold text-white rounded-lg hover:bg-[#333333] transition-colors duration-200 ease-in-out"
                href="/signup"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
