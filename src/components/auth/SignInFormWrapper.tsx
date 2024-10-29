"use client";

import { useRouter } from "next/navigation";
import TheSigninForm from "./TheSignInForm";

export default function SigninFormWrapper() {
  const router = useRouter();

  const handleSuccessfulLogin = () => {
    router.push("/app/dashboard");
  };

  return <TheSigninForm onSuccessfulLogin={handleSuccessfulLogin} />;
}
