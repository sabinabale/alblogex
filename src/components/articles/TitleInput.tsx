import React from "react";
import InputLabel from "@/components/layout/InputLabel";
import { Input } from "@/components/layout/Inputs";

const sanitizeInput = (input: string): string => {
  if (!input) return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/`/g, "&#x60;")
    .trim();
};

const MAX_TITLE_LENGTH = 200;

type TitleInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function TitleInput({
  value,
  onChange,
  error,
}: TitleInputProps) {
  const capitalizeTitle = (title: string) =>
    sanitizeInput(title)
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue.length > MAX_TITLE_LENGTH) {
      return;
    }

    onChange(capitalizeTitle(newValue));
  };

  return (
    <div className="flex flex-col gap-1 w-full md:w-1/2">
      <InputLabel variant="article" htmlFor="articleTitle">
        Article Title
      </InputLabel>
      <Input
        variant="general"
        id="articleTitle"
        type="text"
        placeholder="Why do we need cats in our lives?"
        className="bg-white"
        value={value}
        onChange={handleTitleChange}
        maxLength={MAX_TITLE_LENGTH}
        aria-invalid={!!error}
        aria-describedby={error ? "titleError" : undefined}
      />
      {error && (
        <div id="titleError" className="text-red-500 text-sm mt-1" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
