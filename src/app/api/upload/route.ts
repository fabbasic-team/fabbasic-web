import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/utils/auth";
import { uploadToCloudinary } from "@/utils/cloudinary";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify admin session
    const adminToken = request.cookies.get("fab_admin_session")?.value;
    const session = await verifyAdminSession(adminToken);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "fab-basic/products";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64 Data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";
    const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(base64Data, folder);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
