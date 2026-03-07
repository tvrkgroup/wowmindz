import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteConfig } from "@/lib/site-config";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await getSiteConfig();
    const files = (config.siteFiles || []).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return NextResponse.json({ ok: true, files });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load site files";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
