"use client";

import React, { useState } from "react";

export default function TheForm({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2 w-72">{children}</div>;
}

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = {
      name: name.trim() ? "" : "Name is required",
      email: email.trim() ? "" : "Email is required",
      password: password.trim() ? "" : "Password is required",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      // All fields are valid, proceed with form submission
      console.log("Form submitted:", { name, email, password });
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`border rounded p-2 ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`border rounded p-2 ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`border rounded p-2 ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>
      <button type="submit" className="bg-black text-white rounded p-2 mt-4">
        Register
      </button>
    </form>
  );
}
