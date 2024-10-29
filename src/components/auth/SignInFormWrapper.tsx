"use client";

import { useRouter } from "next/navigation";
import TheSignInForm from "@/components/auth/TheSignInForm";

export default function SignInFormWrapper() {
  const router = useRouter();

  const handleSuccessfulLogin = () => {
    router.push("/app/dashboard");
  };

  return <TheSignInForm onSuccessfulLogin={handleSuccessfulLogin} />;
}
