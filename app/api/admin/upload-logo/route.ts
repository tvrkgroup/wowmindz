import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

function extFromMime(type: string) {
  if (type.includes("png")) return "png";
  if (type.includes("jpeg") || type.includes("jpg")) return "jpg";
  if (type.includes("webp")) return "webp";
  if (type.includes("svg")) return "svg";
  return "png";
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!repo || !token) {
    return NextResponse.json(
      {
        ok: false,
        message: "Missing GITHUB_REPO or GITHUB_TOKEN in environment variables",
      },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "No file uploaded" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, message: "Only image files are allowed" }, { status: 400 });
  }

  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json({ ok: false, message: "Image must be <= 5MB" }, { status: 400 });
  }

  const ext = extFromMime(file.type);
  const filePath = `public/uploads/logo-${Date.now()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const contentBase64 = Buffer.from(arrayBuffer).toString("base64");
  const commitMessage = `Upload logo via admin: ${filePath}`;

  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message: commitMessage,
      content: contentBase64,
      branch,
    }),
  });

  const json = (await response.json()) as { content?: { path?: string; download_url?: string }; message?: string };
  if (!response.ok) {
    return NextResponse.json(
      { ok: false, message: json.message || "GitHub upload failed" },
      { status: response.status }
    );
  }

  const committedPath = json.content?.path || filePath;
  const cdnUrl = `https://cdn.jsdelivr.net/gh/${repo}@${branch}/${committedPath}`;
  return NextResponse.json({ ok: true, logoPath: cdnUrl, committedPath });
}
