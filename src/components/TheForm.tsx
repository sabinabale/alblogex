import React from "react";

export default function TheForm({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2 w-72">{children}</div>;
}

export function LoginForm() {
  return (
    <form className="flex flex-col gap-2">
      <input
        type="email"
        maxLength={40}
        minLength={5}
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        placeholder="Email"
        required
      />
      <input
        type="password"
        maxLength={20}
        minLength={8}
        placeholder="Password"
        required
      />
      <button type="submit" className="mt-4">
        Login
      </button>
    </form>
  );
}

export function RegisterForm() {
  return (
    <form className="flex flex-col gap-2">
      <input type="text" maxLength={20} minLength={3} placeholder="Name" />
      <input
        type="email"
        maxLength={40}
        minLength={5}
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        placeholder="Email"
        required
      />
      <input
        type="password"
        maxLength={20}
        minLength={8}
        placeholder="Password"
        required
      />
      <button type="submit" className="mt-4">
        Register
      </button>
    </form>
  );
}
