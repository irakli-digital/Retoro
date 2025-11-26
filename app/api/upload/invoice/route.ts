import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { getUserId } from "@/lib/auth-server";

/**
 * POST /api/upload/invoice - Upload invoice image
 * 
 * Note: This is a basic implementation. For production, consider using:
 * - Cloudinary
 * - AWS S3
 * - Vercel Blob Storage
 * - Or similar cloud storage service
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    const formData = await request.formData();
    const file = formData.get("invoice") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "invoices");
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const filename = `${userId}_${timestamp}_${randomString}.${extension}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return public URL
    const publicUrl = `/uploads/invoices/${filename}`;
    
    // For production, you'd want to return the full URL
    const fullUrl = process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}${publicUrl}`
      : `${request.nextUrl.origin}${publicUrl}`;

    return NextResponse.json({ url: fullUrl });
  } catch (error) {
    console.error("Error uploading invoice:", error);
    return NextResponse.json(
      { error: "Failed to upload invoice" },
      { status: 500 }
    );
  }
}

