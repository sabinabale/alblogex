import React, { useState, useEffect } from "react";
import Image from "next/image";
import InputLabel from "@/components/layout/InputLabel";

type ImageUploaderProps = {
  uploadedImage: File | null;
  currentImageUrl: string | null;
  onImageUpload: (file: File) => void;
  onImageUrlChange: (url: string | null) => void;
};

export default function ImageUploader({
  uploadedImage,
  currentImageUrl,
  onImageUpload,
  onImageUrlChange,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);

  useEffect(() => {
    if (uploadedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onImageUrlChange(result);
      };
      reader.readAsDataURL(uploadedImage);
    } else {
      setPreviewUrl(currentImageUrl);
    }
  }, [uploadedImage, currentImageUrl, onImageUrlChange]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full md:w-1/2">
      <InputLabel variant="article" htmlFor="imageUpload">
        Featured Image
      </InputLabel>
      <div className="flex items-center gap-4">
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
      </div>
    </div>
  );
}
