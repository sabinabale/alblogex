"use client";
import React, { useState } from "react";
import { useAuth } from "@/utils/hooks/authContext";

interface LoginFormProps {
  onSuccessfulLogin: () => void;
}

export default function TheLoginForm({ onSuccessfulLogin }: LoginFormProps) {
  const { login } = useAuth();
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
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
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
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          email: formData.email.toLowerCase(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Signin failed");
      }

      const data = await res.json();
      login(data.token);

      onSuccessfulLogin();
    } catch (err: unknown) {
      setErrors({
        form: err instanceof Error ? err.message : "Something went wrong",
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
        <div className="relative">
          <label htmlFor="password">Password</label>
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 12.0001L1.11178 11.5407L0.874156 12.0001L1.11178 12.4595L2 12.0001ZM22 12L22.8882 12.4594L23.1258 12L22.8882 11.5406L22 12ZM2.88822 12.4595C5.16609 8.05552 8.65289 6.00008 12 6.00005C15.3471 6.00003 18.8339 8.05542 21.1118 12.4594L22.8882 11.5406C20.3386 6.61125 16.2391 4.00002 12 4.00005C7.76084 4.00008 3.66136 6.61136 1.11178 11.5407L2.88822 12.4595ZM1.11178 12.4595C3.66137 17.3889 7.76085 20.0001 12 20.0001C16.2392 20 20.3386 17.3888 22.8882 12.4594L21.1118 11.5406C18.8339 15.9446 15.3471 18 12 18.0001C8.65288 18.0001 5.16609 15.9447 2.88822 11.5407L1.11178 12.4595ZM14 12C14 13.1046 13.1046 14 12 14V16C14.2091 16 16 14.2091 16 12H14ZM12 14C10.8954 14 10 13.1046 10 12H8C8 14.2091 9.79086 16 12 16V14ZM10 12C10 10.8954 10.8954 10 12 10V8C9.79086 8 8 9.79086 8 12H10ZM12 10C13.1046 10 14 10.8954 14 12H16C16 9.79086 14.2091 8 12 8V10Z"
                  fill="black"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.99995 12.9381C8.64509 17.8771 15.3548 17.8771 20 12.9381M3.99995 7.70431C6.32254 5.23479 9.16127 4.00002 12 4C14.8387 3.99998 17.6774 5.23469 20 7.70413M12 16.75V20M8.5 16.25L7 18.732M15.5 16.25L17 18.732"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
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
