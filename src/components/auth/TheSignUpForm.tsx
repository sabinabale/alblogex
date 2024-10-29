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

export default function TheSignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, loading, errors, handleChange, handleSubmit } = useSignUp();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TheForm>
      <form onSubmit={handleSubmit} className="w-72">
        <div>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            variant="general"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-100 rounded p-2"
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
            onChange={handleChange}
            className="w-full border border-gray-200 rounded p-2"
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
            onChange={handleChange}
            className="w-full border rounded p-2 pr-10 relative"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-[50%] transform -translate-y-1/2 left-[255px]"
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
          <p className="text-red-500 text-sm mt-2">{errors.form}</p>
        )}
      </form>
    </TheForm>
  );
}
