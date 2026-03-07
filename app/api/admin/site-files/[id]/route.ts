import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteSiteFileFromCloudinary } from "@/lib/cloudinary-media";
import { getSiteConfig, updateSiteConfig } from "@/lib/site-config";

export async function DELETE(
  _request: Request,
  context: { params: { id: string } }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = context.params.id;
    if (!id) {
      return NextResponse.json({ ok: false, message: "Missing file id" }, { status: 400 });
    }
    const config = await getSiteConfig();
    const existing = config.siteFiles || [];
    const target = existing.find((item) => item.id === id);
    if (!target) {
      return NextResponse.json({ ok: false, message: "File not found" }, { status: 404 });
    }

    // Cloudinary delete is optional and uses server-side secrets if configured.
    await deleteSiteFileFromCloudinary(target);
    await updateSiteConfig({
      siteFiles: existing.filter((item) => item.id !== id),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete file";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
