import React from "react";
import InputLabel from "@/components/layout/InputLabel";
import { Input } from "@/components/layout/Inputs";

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
    title
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

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
        onChange={(e) => onChange(capitalizeTitle(e.target.value))}
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
