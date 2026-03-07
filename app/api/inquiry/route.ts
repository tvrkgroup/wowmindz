import { NextResponse } from "next/server";
import { addInquiry, type InquiryItem } from "@/lib/inquiries-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<InquiryItem>;
    const name = body.name?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!name || !phone || !message) {
      return NextResponse.json(
        { ok: false, message: "Name, phone, and message are required" },
        { status: 400 }
      );
    }

    const item: InquiryItem = {
      id: `inquiry-${Date.now()}`,
      name: name.slice(0, 80),
      phone: phone.slice(0, 30),
      email: email.slice(0, 120),
      message: message.slice(0, 1200),
      createdAt: new Date().toISOString(),
    };

    await addInquiry(item);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit inquiry";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
