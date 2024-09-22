"use client";

import React, { useState } from "react";

export default function TheRegistrationForm() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
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
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Signup failed");
      }

      setFormData({ name: "", email: "", password: "" });
      // You might want to add a success message or redirect here
    } catch (err: unknown) {
      setErrors({
        form: err instanceof Error ? err.message : "Something went wrong",
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
