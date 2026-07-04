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
      // Import and use production route logic
      try {
        const { put } = await import("@vercel/blob");

        // Upload to Vercel Blob storage
        const blob = await put(file.name, file, {
          access: "public",
        });

        return NextResponse.json({
          message: "File uploaded successfully",
          imageUrl: blob.url,
        });
      } catch (error) {
        console.error("Production upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload to production storage" },
          { status: 500 }
        );
      }
    } else {
      // Development: Save to local directory
      // Save to both admin and client app public folders so both can access
      const adminAppPath = "D:\\e-commerce-admin\\public\\uploads";
      const clientAppPath = "D:\\e-commerce\\public\\uploads";

      try {
        // Save to admin app
        await writeFile(join(adminAppPath, file.name), buffer);
      } catch {
        try {
          await mkdir(adminAppPath, { recursive: true });
          await writeFile(join(adminAppPath, file.name), buffer);
        } catch (mkdirError) {
          console.error(
            "Error creating admin directory or writing file:",
            mkdirError
          );
        }
      }

      try {
        // Save to client app
        await writeFile(join(clientAppPath, file.name), buffer);
      } catch {
        try {
          await mkdir(clientAppPath, { recursive: true });
          await writeFile(join(clientAppPath, file.name), buffer);
        } catch (mkdirError) {
          console.error(
            "Error creating client directory or writing file:",
            mkdirError
          );
        }
      }

      // Use client app URL for user-side access
      const baseUrl = "http://localhost:3000";
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
