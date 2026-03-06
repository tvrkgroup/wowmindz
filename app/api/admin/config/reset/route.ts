import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { resetSiteConfigToDefault } from "@/lib/site-config";

export async function POST() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const config = await resetSiteConfigToDefault();
  return NextResponse.json({ ok: true, config });
}
