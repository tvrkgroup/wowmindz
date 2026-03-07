import crypto from "crypto";
import type { SiteFile } from "@/lib/site-config-schema";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in environment variables`);
  return value;
}

function getCloudinaryCloudName() {
  return requireEnv("CLOUDINARY_CLOUD_NAME");
}

function getUploadPreset() {
  return requireEnv("CLOUDINARY_UPLOAD_PRESET");
}

function getDeleteCredentials() {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) return null;
  return { apiKey, apiSecret };
}

export async function uploadSiteFileToCloudinary(input: {
  file: File;
  category: string;
  uploadedBy?: string;
}): Promise<SiteFile> {
  const cloudName = getCloudinaryCloudName();
  const uploadPreset = getUploadPreset();
  const category = input.category || "general";
  const folder = `site-files/${category}`;

  const formData = new FormData();
  formData.append("file", input.file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  const json = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    asset_id?: string;
    bytes?: number;
    created_at?: string;
    original_filename?: string;
    resource_type?: string;
    format?: string;
    width?: number;
    height?: number;
    error?: { message?: string };
  };

  if (!response.ok || !json.secure_url || !json.public_id) {
    throw new Error(json.error?.message || "Cloudinary upload failed");
  }

  const mimeType =
    input.file.type ||
    `${json.resource_type || "application"}/${json.format || "octet-stream"}`;

  return {
    id: json.asset_id || json.public_id,
    name: input.file.name || json.original_filename || "file",
    url: json.secure_url,
    storagePath: json.public_id,
    publicId: json.public_id,
    assetId: json.asset_id || "",
    mimeType,
    size: json.bytes || input.file.size || 0,
    category,
    width: json.width || 0,
    height: json.height || 0,
    createdAt: json.created_at || new Date().toISOString(),
    uploadedBy: input.uploadedBy || "",
  };
}

export async function deleteSiteFileFromCloudinary(file: SiteFile) {
  const credentials = getDeleteCredentials();
  if (!credentials) return;

  const cloudName = getCloudinaryCloudName();
  const publicId = file.publicId || file.storagePath;
  if (!publicId) return;

  const timestamp = Math.floor(Date.now() / 1000);
  const signatureBase = `public_id=${publicId}&timestamp=${timestamp}${credentials.apiSecret}`;
  const signature = crypto.createHash("sha1").update(signatureBase).digest("hex");

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", credentials.apiKey);
  formData.append("signature", signature);
  formData.append("invalidate", "true");

  const resourceType = file.mimeType.startsWith("video/")
    ? "video"
    : file.mimeType === "application/pdf" || file.mimeType.startsWith("application/")
      ? "raw"
      : "image";

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
    method: "POST",
    body: formData,
  });
}
