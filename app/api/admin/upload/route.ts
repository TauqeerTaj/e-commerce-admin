import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // PRODUCTION vs DEVELOPMENT handling
    if (process.env.NODE_ENV === "production") {
      // In production, use cloud storage
      // This is where you'd integrate with AWS S3, Cloudinary, Vercel Blob, etc.
      return NextResponse.json(
        {
          error:
            "Production storage not configured. Please set up cloud storage.",
        },
        { status: 500 }
      );
    } else {
      // Development: Save to local directory
      // Use absolute path to ensure it works regardless of upload source
      const clientAppPath = "D:\\e-commerce\\public\\uploads";

      try {
        await writeFile(join(clientAppPath, file.name), buffer);
      } catch {
        try {
          await mkdir(clientAppPath, { recursive: true });
          await writeFile(join(clientAppPath, file.name), buffer);
        } catch (mkdirError) {
          console.error(
            "Error creating directory or writing file:",
            mkdirError
          );
          throw mkdirError;
        }
      }

      // Use environment variable for base URL
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const imageUrl = `${baseUrl}/uploads/${file.name}`;

      return NextResponse.json({
        message: "File uploaded successfully",
        imageUrl,
      });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
