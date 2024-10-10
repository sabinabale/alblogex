import React from "react";
import Image from "next/image";
import MailIcon from "@/assets/icons/sendicon-white.svg";

export default function Page() {
  return (
    <div className="flex flex-col items-center mt-40 h-full w-full text-center">
      <div className="bg-black rounded-full p-5 relative">
        <Image
          src={MailIcon}
          alt="Email"
          width={24}
          height={24}
          className="absolute top-1/2 left-[21px] transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="text-2xl font-semibold mt-4">Check your inbox</div>
      <div className="mt-4 text-sm">
        <div className="text-center">
          We&apos;ve sent you an confirmation link.
        </div>
        <div>Please click the link to confirm your address and sign in.</div>
      </div>
    </div>
  );
}
