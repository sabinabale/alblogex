"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavLinkProps, User } from "@/lib/types/supabase";
import { Button } from "@/components/layout/Buttons";
import catIcon from "@/assets/icons/caticon.svg";
import Image from "next/image";
import WriteIcon from "@/assets/icons/write.svg";
import ChevronDown from "@/assets/icons/chevrondown.svg";
import AccountInfo from "@/components/auth/AccountInfo";
import { createClient } from "@/lib/supabase/supabase-client";

const useClickOutside = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return { ref, isOpen, setIsOpen };
};

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`py-1.5 px-2 font-semibold flex-shrink-0 ${
        pathname === href ? "text-black" : "text-black/50 hover:text-black"
      }`}
    >
      {children}
    </Link>
  );
};

const UserMenu = ({ user }: { user: User }) => {
  const { ref, isOpen, setIsOpen } = useClickOutside();

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center justify-center group hover:scale-105 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 text-black flex items-center justify-center font-bold group-hover:bg-black group-hover:text-white transition-all duration-500 ease-in-out">
          {user.user_metadata?.name?.charAt(0).toUpperCase() || "A"}
        </div>
        <Image src={ChevronDown} alt="Open account menu" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1">
          <AccountInfo user={user} />
        </div>
      )}
    </div>
  );
};

export default function TheNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <div className="border-b border-gray-300 bg-white font-medium">
      <nav className="flex max-w-6xl mx-auto justify-between items-center py-2 text-sm text-gray-700 px-5">
        <div className="flex items-center">
          <Link href="/">
            <Image src={catIcon} width={30} height={30} alt="cat icon" />
          </Link>
          <span className="hidden md:block">
            <NavLink href="/">Blog</NavLink>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <NavLink href="/app/dashboard">My articles</NavLink>
              <Link
                className="bg-black flex-shrink-0 text-white hover:bg-[#333333] rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2"
                href="/app/create-article"
              >
                <Image src={WriteIcon} alt="Write article" />
                <span className="hidden md:block">Write article</span>
              </Link>
              <span className="mx-2 opacity-20">|</span>
              <UserMenu user={user} />
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
