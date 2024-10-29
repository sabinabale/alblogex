import React, { useState, useEffect } from "react";
import { Button } from "@/components/layout/Buttons";
import ImageUploader from "./ImageUploader";
import TitleInput from "./TitleInput";
import ContentEditor from "./ContentEditor";
import MarkdownPreview from "./MarkdownPreview";

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
  const [articleTitle, setArticleTitle] = useState(initialTitle);
  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(
    initialImageUrl || null
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    localStorage.setItem("markdownContent", markdownContent);
    localStorage.setItem("articleTitle", articleTitle);
  }, [markdownContent, articleTitle]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!articleTitle.trim()) newErrors.title = "Article title is required";
    if (!markdownContent.trim())
      newErrors.content = "Article content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!validateForm()) return;

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
        <TitleInput
          value={articleTitle}
          onChange={setArticleTitle}
          error={errors.title}
        />
        <ImageUploader
          uploadedImage={uploadedImage}
          currentImageUrl={currentImageUrl}
          onImageUpload={setUploadedImage}
          onImageUrlChange={setCurrentImageUrl}
        />
        <ContentEditor
          content={markdownContent}
          onContentChange={setMarkdownContent}
        />
      </form>
      <MarkdownPreview content={markdownContent} />
    </div>
  );
}
