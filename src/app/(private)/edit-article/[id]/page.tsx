"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import bulbicon from "@/assets/icons/bulb.svg";
import crossicon from "@/assets/icons/cross.svg";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data, error } = await supabase
          .from("Post")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;

        setArticleTitle(data.title);
        setMarkdownContent(data.content);
        setCurrentImageUrl(data.imageUrl);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch article"
        );
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id, supabase]);

  const handlePublish = async () => {
    try {
      setLoading(true);
      let imageUrl = currentImageUrl;

      if (uploadedImage) {
        const fileExt = uploadedImage.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${params.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("alblogex-postimages")
          .upload(filePath, uploadedImage);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("alblogex-postimages")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;

        if (currentImageUrl) {
          const oldFilePath = currentImageUrl.split("/").slice(-2).join("/");
          await supabase.storage
            .from("alblogex-postimages")
            .remove([oldFilePath]);
        }
      }

      const { error } = await supabase
        .from("Post")
        .update({
          title: articleTitle,
          content: markdownContent,
          imageUrl: imageUrl,
        })
        .eq("id", params.id);

      if (error) throw error;

      setLoading(false);
      router.push("/dashboard");
    } catch (err) {
      setLoading(false);
      console.error("Error updating article:", err);
      setError(err instanceof Error ? err.message : "Failed to update article");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setCurrentImageUrl(null);
    const fileInput = document.getElementById(
      "imageUpload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8 text-base">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-bold">Edit article</h1>
        <button
          className="bg-black/90 font-medium text-white text-sm px-3 py-1.5 rounded-md w-fit"
          onClick={handlePublish}
        >
          Publish article
        </button>
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
            handleRemoveImage={handleRemoveImage}
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
  currentImageUrl,
  handleImageUpload,
  handleRemoveImage,
}: {
  uploadedImage: File | null;
  currentImageUrl: string | null;
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
      {(uploadedImage || currentImageUrl) && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {uploadedImage ? uploadedImage.name : "Current image"}
          </span>
          <button
            onClick={handleRemoveImage}
            className="w-fit"
            aria-label="Remove uploaded image"
          >
            <Image
              src={crossicon}
              alt="cross icon"
              className="opacity-60 hover:opacity-100 "
            />
          </button>
        </div>
      )}
      {currentImageUrl && !uploadedImage && (
        <Image
          src={currentImageUrl}
          alt="Current featured image"
          width={100}
          height={100}
        />
      )}
    </>
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
