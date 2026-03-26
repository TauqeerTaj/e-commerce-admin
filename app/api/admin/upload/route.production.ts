// PRODUCTION VERSION - Use this for deployment
import { NextRequest, NextResponse } from "next/server";
import { put } from '@vercel/blob'; // or AWS S3, Cloudinary, etc.

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    // Upload to cloud storage
    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ 
      message: "File uploaded successfully",
      imageUrl: blob.url 
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
