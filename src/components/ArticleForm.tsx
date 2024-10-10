import React, { useState, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/basic/Buttons";
import InputLabel from "@/components/basic/InputLabel";
import { Input } from "@/components/basic/Inputs";
import MarkdownQuickRef from "@/components/basic/MarkdownQuickRef";
import TextEditor from "@/components/TextEditor";

interface ArticleFormProps {
  initialTitle: string;
  initialContent: string;
  initialImageUrl?: string | null;
  onSubmit: (formData: FormData) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
}

export default function ArticleForm({
  initialTitle,
  initialContent,
  initialImageUrl,
  onSubmit,
  submitButtonText,
  isSubmitting,
}: ArticleFormProps) {
  const [articleTitle, setArticleTitle] = useState(initialTitle);
  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(
    initialImageUrl || null
  );
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {}
  );

  useEffect(() => {
    localStorage.setItem("markdownContent", markdownContent);
  }, [markdownContent]);

  useEffect(() => {
    localStorage.setItem("articleTitle", articleTitle);
  }, [articleTitle]);

  useEffect(() => {
    setCurrentImageUrl(initialImageUrl || null);
  }, [initialImageUrl]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setCurrentImageUrl(URL.createObjectURL(file));
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

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", articleTitle);
    formData.append("content", markdownContent);
    if (uploadedImage) {
      formData.append("image", uploadedImage);
    } else if (currentImageUrl) {
      formData.append("imageUrl", currentImageUrl);
    }

    await onSubmit(formData);
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
        <h1>{initialTitle ? "Edit article" : "Create a new article"}</h1>
        <Button
          variant="primary"
          size="default"
          type="submit"
          onClick={handleSubmit}
          className="bg-black/90 font-medium text-white text-sm px-3 py-1.5 w-fit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : submitButtonText}
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
              currentImageUrl={currentImageUrl}
              handleImageUpload={handleImageUpload}
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

  return (
    <div className="flex flex-col gap-2">
      {previewUrl && (
        <div className="relative w-24 h-24 mb-2">
          <Image
            src={previewUrl}
            alt="Preview"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
      )}

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
        {uploadedImage || currentImageUrl ? "Change Image" : "Upload Image"}
      </label>
    </div>
  );
};
