import { NextResponse } from "next/server";
import { getAuthenticatedAdminUsername, isAdminAuthenticated } from "@/lib/admin-auth";
import { uploadSiteFileToCloudinary } from "@/lib/cloudinary-media";
import { getSiteConfig, updateSiteConfig } from "@/lib/site-config";

const ALLOWED_CATEGORIES = new Set([
  "images",
  "events",
  "news",
  "blogs",
  "branding",
  "documents",
  "general",
]);

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const categoryInput = (formData.get("category") || "general").toString().trim().toLowerCase();
    const category = ALLOWED_CATEGORIES.has(categoryInput) ? categoryInput : "general";
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, message: "No file uploaded" }, { status: 400 });
    }

    const maxBytes = 15 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ ok: false, message: "File must be <= 15MB" }, { status: 400 });
    }

    const uploadedBy = await getAuthenticatedAdminUsername();
    const uploaded = await uploadSiteFileToCloudinary({
      file,
      category,
      uploadedBy: uploadedBy || undefined,
    });
    const current = await getSiteConfig();
    await updateSiteConfig({
      siteFiles: [uploaded, ...(current.siteFiles || [])],
    });
    return NextResponse.json({ ok: true, file: uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
