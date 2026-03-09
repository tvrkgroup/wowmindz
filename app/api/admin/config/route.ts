import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteConfig, updateSiteConfig } from "@/lib/site-config";
import type { SiteConfig } from "@/lib/site-config-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const config = await getSiteConfig();
  return NextResponse.json({ ok: true, config });
}

export async function PUT(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as Partial<SiteConfig>;
    const config = await updateSiteConfig(payload);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, config });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
