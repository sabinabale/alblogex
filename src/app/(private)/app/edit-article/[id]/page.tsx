"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/basic/Buttons";
import MarkdownQuickRef from "@/components/basic/MarkdownQuickRef";

export default function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [markdownContent, setMarkdownContent] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsSubmitting(true);
        const { data, error } = await supabase
          .from("Post")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;

        setArticleTitle(data.title);
        setMarkdownContent(data.content);
        setCurrentImageUrl(data.imageUrl);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch article"
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    fetchArticle();
  }, [params.id, supabase]);

  const handlePublish = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", articleTitle);
      formData.append("content", markdownContent);
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      } else if (currentImageUrl) {
        formData.append("imageUrl", currentImageUrl);
      }
      if (params.id) {
        formData.append("postId", params.id);
      }

      const response = await fetch("/api/articles", {
        method: params.id ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save article");
      }

      const result = await response.json();

      if (result.success) {
        if (result.imageUrl) {
          setCurrentImageUrl(result.imageUrl);
        }

        router.push(
          "/app/dashboard?message=Article updated successfully!&type=success"
        );
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    } catch (err) {
      console.error("Error updating article:", err);
      setError(err instanceof Error ? err.message : "Failed to update article");

      router.push(
        `/app/dashboard?message=${encodeURIComponent(
          err instanceof Error ? err.message : "Failed to update article"
        )}&type=error`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8 text-base mb-8">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-bold">Edit article</h1>
        <Button
          variant="primary"
          size="default"
          type="submit"
          form="articleForm"
          onClick={handlePublish}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish article"}
        </Button>
      </div>
      <div className="flex flex-col gap-1 w-1/2">
        <div className="font-medium pl-1">Article title</div>
        <input
          type="text"
          placeholder="Article title"
          className="bg-white"
          value={articleTitle}
          onChange={(e) => setArticleTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1 w-1/2">
        <div className="font-medium pl-1">Featured image</div>
        <div className="flex items-center gap-4">
          <ImageUpload
            uploadedImage={uploadedImage}
            currentImageUrl={currentImageUrl}
            handleImageUpload={handleImageUpload}
          />
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col gap-1 w-1/2">
          <TextEditor
            markdownContent={markdownContent}
            setMarkdownContent={setMarkdownContent}
          />
        </div>
        <MarkdownQuickRef />
      </div>
      <div className="w-1/2">
        <div className="font-medium pl-1 mb-1">Preview</div>
        <div className="px-3 py-1.5 border border-gray-300 rounded-md prose bg-white h-80 overflow-auto leading-normal">
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

const ImageUpload = ({
  uploadedImage,
  currentImageUrl,
  handleImageUpload,
}: {
  uploadedImage: File | null;
  currentImageUrl: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);

  useEffect(() => {
    if (uploadedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(uploadedImage);
    } else {
      setPreviewUrl(currentImageUrl);
    }
  }, [uploadedImage, currentImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event);
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {previewUrl && (
        <Image
          src={previewUrl}
          alt="Featured image"
          width={100}
          height={100}
          className="rounded-md ml-1"
        />
      )}

      <div className="flex flex-col gap-2 ml-1">
        <input
          type="file"
          accept="image/*"
          id="imageUpload"
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="imageUpload"
          className="text-cyan-700 cursor-pointer text-sm font-medium"
        >
          Update
        </label>
      </div>
    </div>
  );
};

const TextEditor = ({
  markdownContent,
  setMarkdownContent,
}: {
  markdownContent: string;
  setMarkdownContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      <div className="font-medium pl-1">Article content</div>
      <textarea
        placeholder="Article content"
        className="p-2 h-80 border border-gray-300 resize-none overflow-auto"
        value={markdownContent}
        onChange={(e) => setMarkdownContent(e.target.value)}
      />
    </>
  );
};
