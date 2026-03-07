import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listInquiries, getInquiryStorageMode } from "@/lib/inquiries-store";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const inquiries = await listInquiries();
    return NextResponse.json({ ok: true, inquiries, storage: getInquiryStorageMode() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load inquiries";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
