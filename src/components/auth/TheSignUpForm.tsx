"use client";

import React, { useState } from "react";
import Image from "next/image";
import InputLabel from "@/components/layout/InputLabel";
import { Input } from "../layout/Inputs";
import passwordShow from "@/assets/icons/passwordvisible.svg";
import passwordHide from "@/assets/icons/passwordhidden.svg";
import TheForm from "../layout/TheForm";
import SpinnerIcon from "@/assets/icons/loginspinner.svg";
import { Button } from "../layout/Buttons";
import useSignUp from "@/lib/hooks/useSignUp";

const sanitizeInput = (value: string): string => {
  return value.replace(/[<>]/g, "");
};

const MAX_INPUT_LENGTH = 256;

export default function TheSignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, loading, errors, handleChange, handleSubmit } = useSignUp();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSafeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value.length > MAX_INPUT_LENGTH) return;

    // Sanitize input but preserve case
    const sanitizedValue = sanitizeInput(value);

    console.log(`Typing in ${name}:`, sanitizedValue); // Debugging log

    // Create a synthetic event only when needed
    handleChange({
      target: { name, value: sanitizedValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSafeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.name) {
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
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            variant="general"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleSafeChange}
            maxLength={MAX_INPUT_LENGTH}
            autoComplete="name"
            className="w-full border border-gray-100 rounded p-2"
            aria-invalid={!!errors.name}
          />
          <p className="text-red-500 text-xs h-6 pt-1 pl-1">
            {errors.name || "\u00A0"}
          </p>
        </div>

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
            className="w-full border border-gray-200 rounded p-2"
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
            autoComplete="new-password"
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
          className="w-full leading-[30px] mt-4"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <>
              <Image src={SpinnerIcon} alt="Spinner" className="mr-2" />
              <span>Creating your account...</span>
            </>
          ) : (
            "Sign up"
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
