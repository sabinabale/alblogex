"use client";

import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import passwordShow from "@/assets/icons/passwordvisible.svg";
import passwordHide from "@/assets/icons/passwordhidden.svg";
import Image from "next/image";
import InputLabel from "@/components/InputLabel";

interface SigninFormProps {
  onSuccessfulLogin: () => void;
}

export default function TheSigninForm({ onSuccessfulLogin }: SigninFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const supabase = createClientComponentClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      onSuccessfulLogin();
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-8 shadow-sm bg-white">
      <form onSubmit={handleSubmit} className="w-72">
        <div>
          <InputLabel htmlFor="email">Email</InputLabel>
          <input
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
          <input
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
        <button
          className={`w-full h-[42px] text-[14px] font-medium mt-4 ${
            loading
              ? "bg-gray-500 cursor-not-allowed border-gray-400"
              : "bg-black/90 hover:bg-[#333333]"
          } text-white transition-colors duration-200 ease-in-out p-2 rounded-md`}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                className="inline-block mr-2 animate-spin"
              >
                <path
                  fill="currentColor"
                  d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,1,1,1,8-8A8,8,0,0,1,12,20Z"
                  opacity={0.25}
                />
                <path
                  fill="currentColor"
                  d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
                >
                  <animateTransform
                    attributeName="transform"
                    dur="10s"
                    repeatCount="indefinite"
                    type="rotate"
                    values="0 12 12;360 12 12"
                  />
                </path>
              </svg>
              Signing you in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
        {errors.form && (
          <p className="text-red-500 text-sm mt-2">{errors.form}</p>
        )}
      </form>
    </div>
  );
}
