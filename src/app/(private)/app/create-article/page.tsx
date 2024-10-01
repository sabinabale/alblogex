"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import crossicon from "@/assets/icons/cross.svg";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/basic/Buttons";
import InputLabel from "@/components/basic/InputLabel";
import { Input } from "@/components/basic/Inputs";
import MarkdownQuickRef from "@/components/basic/MarkdownQuickRef";
import TextEditor from "@/components/TextEditor";

export default function Page() {
  const [markdownContent, setMarkdownContent] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/signin");
      }
    };
    checkSession();
  }, [supabase, router]);

  useEffect(() => {
    setMarkdownContent(localStorage.getItem("markdownContent") || "");
    setArticleTitle(localStorage.getItem("articleTitle") || "");
  }, []);

  useEffect(() => {
    localStorage.setItem("markdownContent", markdownContent);
  }, [markdownContent]);

  useEffect(() => {
    localStorage.setItem("articleTitle", articleTitle);
  }, [articleTitle]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    const fileInput = document.getElementById(
      "imageUpload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};

    if (!articleTitle.trim()) {
      newErrors.title = "Article title is required";
    }

    if (!markdownContent.trim()) {
      newErrors.content = "Article content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push(
          "/signin?message=Your session has expired. Please log in again.&type=error"
        );
        return;
      }

      const formData = new FormData();
      formData.append("title", articleTitle);
      formData.append("content", markdownContent);
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      const response = await fetch("/api/articles", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Server error:", result);
        throw new Error(result.error || "Failed to create article");
      }

      setArticleTitle("");
      setMarkdownContent("");
      setUploadedImage(null);
      localStorage.removeItem("articleTitle");
      localStorage.removeItem("markdownContent");

      router.push(
        `/app/dashboard?message=Article created successfully!&type=success`
      );
    } catch (error) {
      console.error("Error creating article:", error);

      router.push(
        `/app/dashboard?message=Failed to create article. Please try again.&type=error`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const capitalizeTitle = (title: string) => {
    return title
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-8 text-base mb-8">
      <div className="flex gap-4 items-center">
        <h1>Create a new article</h1>
        <Button
          variant="primary"
          size="default"
          type="submit"
          className="bg-black/90 font-medium text-white text-sm px-3 py-1.5 w-fit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish Article"}
        </Button>
      </div>
      <form id="articleForm" onSubmit={handleSubmit} className="space-y-8">
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
            value={articleTitle}
            onChange={(e) => setArticleTitle(capitalizeTitle(e.target.value))}
          />
          {errors.title && (
            <div className="text-red-500 text-sm mt-1">{errors.title}</div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full md:w-1/2">
          <InputLabel variant="article" htmlFor="imageUpload">
            Featured Image
          </InputLabel>
          <div className="flex items-center gap-4">
            <ImageUpload
              uploadedImage={uploadedImage}
              handleImageUpload={handleImageUpload}
              handleRemoveImage={handleRemoveImage}
            />
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col gap-1 w-full md:w-1/2">
            <TextEditor
              markdownContent={markdownContent}
              setMarkdownContent={setMarkdownContent}
            />
          </div>
          <MarkdownQuickRef />
        </div>
      </form>
      <div className="w-full md:w-1/2">
        <div id="previewLabel">Preview</div>
        <div
          className="px-3 py-1.5 border border-gray-300 rounded-md prose bg-white h-80 overflow-auto leading-normal"
          aria-labelledby="previewLabel"
        >
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

const ImageUpload = ({
  uploadedImage,
  handleImageUpload,
  handleRemoveImage,
}: {
  uploadedImage: File | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
}) => {
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        id="imageUpload"
        className="sr-only"
        onChange={handleImageUpload}
        aria-label="Upload image"
      />
      <label
        htmlFor="imageUpload"
        className="bg-gray-500 hover:bg-gray-600 font-medium text-white text-sm px-3 py-1.5 rounded-md w-fit cursor-pointer"
      >
        Upload Image
      </label>
      {uploadedImage && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-600">{uploadedImage.name}</span>
          <button
            onClick={handleRemoveImage}
            className="w-fit"
            aria-label="Remove Uploaded Image"
          >
            <Image
              src={crossicon}
              alt=""
              className="opacity-60 hover:opacity-100"
            />
          </button>
        </div>
      )}
    </div>
  );
};
