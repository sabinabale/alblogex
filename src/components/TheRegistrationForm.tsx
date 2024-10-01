"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import InputLabel from "@/components/basic/InputLabel";
import { Input } from "./basic/Inputs";
import passwordShow from "@/assets/icons/passwordvisible.svg";
import passwordHide from "@/assets/icons/passwordhidden.svg";
import Image from "next/image";
import TheForm from "./basic/TheForm";
import SpinnerIcon from "@/assets/icons/loginspinner.svg";
import { Button } from "./basic/Buttons";

export default function TheRegistrationForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.includes("<") || value.includes(">")) {
      setErrors((prev) => ({
        ...prev,
        [name]: "<> characters are not allowed",
      }));
    } else {
      setFormData({
        ...formData,
        [name]: name === "email" ? value.toLowerCase() : value,
      });
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    if (formData.name.includes("<") || formData.name.includes(">"))
      newErrors.name = "<> characters are not allowed";
    if (formData.email.includes("<") || formData.email.includes(">"))
      newErrors.email = "<> characters are not allowed";
    if (formData.password.includes("<") || formData.password.includes(">"))
      newErrors.password = "<> characters are not allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const res = await fetch("/api/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || "Failed to create user in database"
          );
        }
      }

      setFormData({ name: "", email: "", password: "" });
      router.push("/confirm-email");
    } catch (err: unknown) {
      setErrors({
        form:
          err instanceof Error
            ? err.message
            : "Something went wrong during registration",
      });
    } finally {
      setLoading(false);
    }
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
