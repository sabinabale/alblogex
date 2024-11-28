"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import passwordShow from "@/assets/icons/passwordvisible.svg";
import passwordHide from "@/assets/icons/passwordhidden.svg";
import SpinnerIcon from "@/assets/icons/loginspinner.svg";
import InputLabel from "@/components/layout/InputLabel";
import { Input } from "@/components/layout/Inputs";
import { Button } from "@/components/layout/Buttons";
import TheForm from "@/components/layout/TheForm";
import useSignIn from "@/lib/hooks/useSignIn";

const sanitizeInput = (input: string): string => {
  if (!input) return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/`/g, "&#x60;");
};

const MAX_INPUT_LENGTH = 256;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSuccessfulLogin = () => {
    router.push("/app/dashboard");
  };

  const { formData, loading, errors, handleChange, handleSubmit } = useSignIn(
    handleSuccessfulLogin
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSafeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value.length > MAX_INPUT_LENGTH) {
      return;
    }

    if (name === "email") {
      const sanitizedEmail = sanitizeInput(value.toLowerCase());
      const safeEvent = {
        ...e,
        target: {
          ...e.target,
          value: sanitizedEmail,
        },
      };
      handleChange(safeEvent);
    } else if (name === "password") {
      handleChange(e);
    }
  };

  const handleSafeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return;
    }

    handleSubmit(e);
  };

  return (
    <TheForm>
      <form onSubmit={handleSafeSubmit} className="w-72" autoComplete="off">
        <div>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            variant="general"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleSafeChange}
            maxLength={MAX_INPUT_LENGTH}
            autoComplete="username"
            spellCheck={false}
            aria-invalid={!!errors.email}
          />
          <p className="text-red-500 text-xs h-6 pt-1 pl-1">
            {errors.email || "\u00A0"}
          </p>
        </div>

        <div className="relative">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            variant="general"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleSafeChange}
            maxLength={MAX_INPUT_LENGTH}
            autoComplete="current-password"
            className="w-full border rounded p-2 pr-10 relative"
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-[50%] transform -translate-y-1/2 left-[255px]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <Image src={passwordShow} alt="Show password" />
            ) : (
              <Image src={passwordHide} alt="Hide password" />
            )}
          </button>
          <p className="text-red-500 text-xs h-6 pt-1 pl-1">
            {errors.password || "\u00A0"}
          </p>
        </div>

        <Button
          variant="primary"
          size="default"
          className="w-full mt-4 leading-[30px]"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Image src={SpinnerIcon} alt="Spinner" className="mr-2" />
              <span>Signing you in...</span>
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        {errors.form && (
          <p className="text-red-500 text-sm mt-2" role="alert">
            {errors.form}
          </p>
        )}
      </form>
    </TheForm>
  );
}
