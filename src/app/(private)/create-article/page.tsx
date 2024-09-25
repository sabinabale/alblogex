"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import bulbicon from "@/assets/icons/bulb.svg";
import crossicon from "@/assets/icons/cross.svg";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Page() {
  const [markdownContent, setMarkdownContent] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {}
  );
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

      const response = await fetch("/api/create-article", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create article");
      }

      alert("Article created successfully!");
      setArticleTitle("");
      setMarkdownContent("");
      setUploadedImage(null);
      localStorage.removeItem("articleTitle");
      localStorage.removeItem("markdownContent");

      router.push(`/dashboard`);
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Failed to create article. Please try again.");
    }
  };

  return (
    <div className="space-y-8 text-base mb-8">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-bold">Create a new article</h1>
        <button
          type="submit"
          form="articleForm"
          className="bg-black/90 font-medium text-white text-sm px-3 py-1.5 rounded-md w-fit"
        >
          Publish article
        </button>
      </div>
      <form id="articleForm" onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col gap-1 w-1/2">
          <label htmlFor="articleTitle" className="font-medium pl-1">
            Article title
          </label>
          <input
            id="articleTitle"
            type="text"
            placeholder="Article title"
            className="bg-white"
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
          />
          {errors.title && (
            <div className="text-red-500 text-sm mt-1">{errors.title}</div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-1/2">
          <div className="font-medium pl-1">Featured image</div>
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
      </form>
      <div className="w-1/2">
        <div className="font-medium pl-1 mb-1">Preview</div>
        <div className="px-3 py-1.5 border border-gray-300 rounded-md prose bg-white h-80 overflow-auto">
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
    <div className="mt-7 border border-cyan-600/30 bg-cyan-600/20 rounded-md pl-4 pr-8 py-6 h-fit">
      <div className="font-bold mb-4 flex gap-2 items-center">
        <Image src={bulbicon} alt="bulb icon" />
        Quick markdown refresher
      </div>
      <ul className="space-y-0.5 text-[14px]">
        <li className="pl-8">
          # <span className="font-semibold">Headings start with a hash</span>
        </li>
        <li className="pl-8">
          - use two asterisks to make text ✳✳
          <span className="font-bold">bold</span>✳✳
        </li>
        <li className="pl-8">
          - use one asterisk to make text ✳
          <span className="italic">italic</span>✳
        </li>
        <li className="pl-8">- use a blank line to separate paragraphs</li>
        <li className="pt-4 pl-2">
          See more here:{" "}
          <a
            href="https://www.markdownguide.org/basic-syntax/"
            target="_blank"
            className="text-cyan-700 underline underline-offset-2 font-medium"
          >
            Markdown Guide
          </a>
        </li>
      </ul>
    </div>
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
    <>
      <input
        type="file"
        accept="image/*"
        id="imageUpload"
        className="hidden"
        onChange={handleImageUpload}
      />
      <label
        htmlFor="imageUpload"
        className="bg-gray-500 hover:bg-gray-600 font-medium text-white text-sm px-3 py-1.5 rounded-md w-fit cursor-pointer"
      >
        Upload image
      </label>
      {uploadedImage && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{uploadedImage.name}</span>
          <button
            onClick={handleRemoveImage}
            className="w-fit"
            aria-label="Remove uploaded image"
          >
            <Image
              src={crossicon}
              alt="cross icon"
              className="opacity-60 hover:opacity-100"
            />
          </button>
        </div>
      )}
    </>
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
      <label htmlFor="articleContent" className="font-medium pl-1">
        Article content
      </label>
      <textarea
        id="articleContent"
        placeholder="Article content"
        className="p-2 h-80 border border-gray-300 resize-none overflow-auto"
        value={markdownContent}
        onChange={(e) => setMarkdownContent(e.target.value)}
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </>
  );
};
