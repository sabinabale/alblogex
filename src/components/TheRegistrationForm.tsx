"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function TheRegistrationForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const [blocklist, setBlocklist] = useState<string[]>([]);

  useEffect(() => {
    async function loadBlocklist() {
      try {
        const response = await fetch("/api/disposable-email-blocklist");
        if (!response.ok) {
          throw new Error("Failed to load blocklist");
        }
        const content = await response.text();
        setBlocklist(content.split("\r\n").slice(0, -1));
      } catch (error) {
        console.error("Error loading blocklist:", error);
      }
    }

    loadBlocklist();
  }, []);

  const isDisposable = (email: string) => {
    return blocklist.includes(email.split("@")[1].toLowerCase());
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
    else if (isDisposable(formData.email))
      newErrors.email = "Disposable emails are not allowed";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    // Check for <> characters
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
      // Step 1: Sign up with Supabase
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
      router.push("/signin");
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
    <div className="border border-gray-200 rounded-xl p-8 shadow-sm bg-white">
      <form onSubmit={handleSubmit} className="w-72">
        <div>
          <label htmlFor="name">Name</label>
          <input
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
          <label htmlFor="email">Email</label>
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
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
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
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="inline-block mr-2 animate-spin"
              >
                <path
                  fill="currentColor"
                  d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                  opacity="0.25"
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
              Creating your account...
            </>
          ) : (
            "Sign up"
          )}
        </button>
        {errors.form && (
          <p className="text-red-500 text-sm mt-2">{errors.form}</p>
        )}
      </form>
    </div>
  );
}
