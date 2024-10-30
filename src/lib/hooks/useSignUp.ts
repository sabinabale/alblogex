import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/supabase-client";

type FormData = {
  name: string;
  email: string;
  password: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  form?: string;
};

export default function useSignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.includes("<") || value.includes(">")) {
      setErrors((prev) => ({
        ...prev,
        [name]: "<> characters are not allowed",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "email" ? value.toLowerCase() : value,
      }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
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
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
          emailRedirectTo: "https://alblogex.vercel.app/signin",
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
    } catch (err) {
      setErrors({
        form:
          err instanceof Error
            ? err.message
            : "Something went wrong during sign up",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    errors,
    handleChange,
    handleSubmit,
  };
}
