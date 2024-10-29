"use client";

import { useRouter } from "next/navigation";
import TheSignInForm from "./TheSignInForm";

export default function SigninFormWrapper() {
  const router = useRouter();

  const handleSuccessfulLogin = () => {
    router.push("/app/dashboard");
  };

  return <TheSignInForm onSuccessfulLogin={handleSuccessfulLogin} />;
}
