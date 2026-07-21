"use client";

import { useState } from "react";
import Image from "next/image";

interface MultiImageUploadProps {
  onImagesUpload: (imageUrls: string[]) => void;
  currentImages?: string[];
}

export default function MultiImageUpload({
  onImagesUpload,
  currentImages = [],
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(currentImages);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check file types
    const invalidFiles = files.filter(file => !file.type.startsWith("image/"));
    if (invalidFiles.length > 0) {
      alert("Please select only image files");
      return;
    }

    // Check file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert("Some images are larger than 5MB");
      return;
    }

    // Upload files
    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return data.imageUrl;
        } else {
          throw new Error("Upload failed");
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...previews, ...uploadedUrls];
      setPreviews(newImages);
      onImagesUpload(newImages);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload some images");
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newImages = previews.filter((_, i) => i !== index);
    setPreviews(newImages);
    onImagesUpload(newImages);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Additional Images
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative">
              <Image
                src={preview}
                alt={`Additional image ${idx + 1}`}
                width={200}
                height={200}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 text-xs w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        id="multi-image-upload"
        disabled={uploading}
      />

      <label
        htmlFor="multi-image-upload"
        className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          uploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {uploading ? "Uploading..." : "+ Add Images"}
      </label>

      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
    </div>
  );
}
