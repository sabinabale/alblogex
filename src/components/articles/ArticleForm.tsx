import React, { useState, useEffect } from "react";
import { Button } from "@/components/layout/Buttons";
import ImageUploader from "./ImageUploader";
import TitleInput from "./TitleInput";
import ContentEditor from "./ContentEditor";
import MarkdownPreview from "./MarkdownPreview";

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
const MAX_CONTENT_LENGTH = 50000;

type ArticleFormProps = {
  initialTitle: string;
  initialContent: string;
  initialImageUrl?: string | null;
  onSubmit: (formData: FormData) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
};

type FormErrors = {
  title?: string;
  content?: string;
};

export default function ArticleForm({
  initialTitle,
  initialContent,
  initialImageUrl,
  onSubmit,
  submitButtonText,
  isSubmitting,
}: ArticleFormProps) {
  const [articleTitle, setArticleTitle] = useState(sanitizeInput(initialTitle));
  const [markdownContent, setMarkdownContent] = useState(
    sanitizeInput(initialContent)
  );
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(
    initialImageUrl ? sanitizeInput(initialImageUrl) : null
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const sanitizedContent = sanitizeInput(markdownContent);
    const sanitizedTitle = sanitizeInput(articleTitle);

    localStorage.setItem("markdownContent", sanitizedContent);
    localStorage.setItem("articleTitle", sanitizedTitle);
  }, [markdownContent, articleTitle]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const sanitizedTitle = sanitizeInput(articleTitle);
    const sanitizedContent = sanitizeInput(markdownContent);

    if (!sanitizedTitle.trim()) {
      newErrors.title = "Article title is required";
    }
    if (sanitizedTitle.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title must be less than ${MAX_TITLE_LENGTH} characters`;
    }

    if (!sanitizedContent.trim()) {
      newErrors.content = "Article content is required";
    }
    if (sanitizedContent.length > MAX_CONTENT_LENGTH) {
      newErrors.content = `Content must be less than ${MAX_CONTENT_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTitleChange = (value: string) => {
    const sanitizedTitle = sanitizeInput(value);
    if (sanitizedTitle.length <= MAX_TITLE_LENGTH) {
      setArticleTitle(sanitizedTitle);
    }
  };

  const handleContentChange = (value: string) => {
    const sanitizedContent = sanitizeInput(value);
    if (sanitizedContent.length <= MAX_CONTENT_LENGTH) {
      setMarkdownContent(sanitizedContent);
    }
  };

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", sanitizeInput(articleTitle));
    formData.append("content", sanitizeInput(markdownContent));

    if (uploadedImage) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(uploadedImage.type)) {
        setErrors((prev) => ({ ...prev, image: "Invalid file type" }));
        return;
      }
      if (uploadedImage.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({ ...prev, image: "File size too large" }));
        return;
      }
      formData.append("image", uploadedImage);
    } else if (currentImageUrl) {
      formData.append("imageUrl", sanitizeInput(currentImageUrl));
    }

    await onSubmit(formData);
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
      <form
        id="articleForm"
        onSubmit={handleSubmit}
        className="space-y-8"
        encType="multipart/form-data"
      >
        <TitleInput
          value={articleTitle}
          onChange={handleTitleChange}
          error={errors.title}
        />
        <ImageUploader
          uploadedImage={uploadedImage}
          currentImageUrl={currentImageUrl}
          onImageUpload={setUploadedImage}
          onImageUrlChange={(url) =>
            setCurrentImageUrl(url ? sanitizeInput(url) : null)
          }
        />
        <ContentEditor
          content={markdownContent}
          onContentChange={handleContentChange}
        />
      </form>
      <MarkdownPreview content={markdownContent} />
    </div>
  );
}
