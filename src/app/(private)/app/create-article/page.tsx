"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import bulbicon from "@/assets/icons/bulb.svg";
import crossicon from "@/assets/icons/cross.svg";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/basic/Buttons";
import InputLabel from "@/components/basic/InputLabel";
import { Input } from "@/components/basic/Inputs";

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
        alert("Your session has expired. Please log in again.");
        router.push("/signin");
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

      alert("Article created successfully!");
      setArticleTitle("");
      setMarkdownContent("");
      setUploadedImage(null);
      localStorage.removeItem("articleTitle");
      localStorage.removeItem("markdownContent");

      router.push(`/app/dashboard`);
    } catch (error) {
      console.error("Error creating article:", error);
      alert(
        "Failed to create article. Please check the console for more details."
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
        <h1 className="text-2xl font-bold">Create a new article</h1>
      </div>
      <form id="articleForm" onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col gap-1 w-1/2">
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
        <div className="flex flex-col gap-1 w-1/2">
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
          <div className="flex flex-col gap-1 w-1/2">
            <TextEditor
              markdownContent={markdownContent}
              setMarkdownContent={setMarkdownContent}
              error={errors.content}
            />
          </div>
          <MarkdownQuickRef />
        </div>
        <Button
          variant="primary"
          size="default"
          type="submit"
          className="bg-black/90 font-medium text-white text-sm px-3 py-1.5 rounded-md w-fit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish Article"}
        </Button>
      </form>
      <div className="w-1/2">
        <div id="previewLabel">Preview</div>
        <div
          className="px-3 py-1.5 border border-gray-300 rounded-md prose bg-white h-80 overflow-auto"
          aria-labelledby="previewLabel"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-2xl font-bold" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-xl font-bold" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-lg font-bold" {...props} />
              ),
              p: ({ ...props }) => <p className="mt-2" {...props} />,
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

const MarkdownQuickRef = () => {
  return (
    <aside
      className="mt-7 border border-cyan-600/30 bg-cyan-600/20 rounded-md pl-4 pr-8 py-6 h-fit"
      aria-labelledby="quickref-title"
    >
      <h2
        id="quickref-title"
        className="font-bold mb-4 flex gap-2 items-center"
      >
        <Image src={bulbicon} alt="" />
        Quick Markdown Refresher
      </h2>
      <ul
        className="space-y-0.5 text-[14px]"
        aria-label="Markdown syntax examples"
      >
        <li className="pl-8">
          # <span className="font-semibold">Headings Start With A Hash</span>
        </li>
        <li className="pl-8">
          - Use Two Asterisks To Make Text ✳✳
          <span className="font-bold">Bold</span>✳✳
        </li>
        <li className="pl-8">
          - Use One Asterisk To Make Text ✳
          <span className="italic">Italic</span>✳
        </li>
        <li className="pl-8">- Use A Blank Line To Separate Paragraphs</li>
      </ul>
      <p className="pt-4 pl-2">
        See More Here:{" "}
        <a
          href="https://www.markdownguide.org/basic-syntax/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-700 underline underline-offset-2 font-medium"
        >
          Markdown Guide
        </a>
      </p>
    </aside>
  );
};

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

const TextEditor = ({
  markdownContent,
  setMarkdownContent,
  error,
}: {
  markdownContent: string;
  setMarkdownContent: React.Dispatch<React.SetStateAction<string>>;
  error?: string;
}) => {
  return (
    <>
      <InputLabel variant="article" htmlFor="articleContent">
        Article Content
      </InputLabel>
      <textarea
        id="articleContent"
        placeholder="Article Content"
        className="p-2 h-80 border border-gray-300 resize-none overflow-auto"
        value={markdownContent}
        onChange={(e) => setMarkdownContent(e.target.value)}
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </>
  );
};
