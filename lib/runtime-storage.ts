export interface FirebaseCredentials {
  base: string;
  secret: string;
}

function normalizeEnvValue(value: string | undefined): string {
  if (!value) return "";
  return value.trim().replace(/^['"]|['"]$/g, "");
}

function parseCombinedFirebaseConfig(raw: string): FirebaseCredentials {
  const value = normalizeEnvValue(raw);
  if (!value) return { base: "", secret: "" };

  if (value.startsWith("{")) {
    try {
      const parsed = JSON.parse(value) as {
        url?: string;
        base?: string;
        databaseUrl?: string;
        secret?: string;
        token?: string;
      };
      const base = normalizeEnvValue(parsed.url || parsed.base || parsed.databaseUrl);
      const secret = normalizeEnvValue(parsed.secret || parsed.token);
      return { base, secret };
    } catch {
      return { base: "", secret: "" };
    }
  }

  if (value.includes("|")) {
    const [base, secret] = value.split("|");
    return { base: normalizeEnvValue(base), secret: normalizeEnvValue(secret) };
  }

  return { base: "", secret: "" };
}

export function resolveFirebaseCredentials(): FirebaseCredentials {
  const combined = normalizeEnvValue(
    process.env.FIREBASE_CREDENTIALS || process.env.FIREBASE_CONFIG || process.env.SB_FIREBASE_CONFIG
  );
  if (combined) {
    const parsed = parseCombinedFirebaseConfig(combined);
    if (parsed.base && parsed.secret) return parsed;
  }

  const base = normalizeEnvValue(
    process.env.FIREBASE_DB_URL ||
      process.env.FIREBASE_DATABASE_URL ||
      process.env.SB_FIREBASE_DB_URL ||
      process.env.NEXT_PUBLIC_FIREBASE_DB_URL
  );
  const secret = normalizeEnvValue(
    process.env.FIREBASE_DB_SECRET ||
      process.env.FIREBASE_SECRET ||
      process.env.FIREBASE_DATABASE_SECRET ||
      process.env.SB_FIREBASE_DB_SECRET ||
      process.env.NEXT_PUBLIC_FIREBASE_DB_SECRET
  );

  return { base, secret };
}

export function hasFirebaseCredentials() {
  const creds = resolveFirebaseCredentials();
  return Boolean(creds.base && creds.secret);
}

export function hasKvCredentials() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export function runtimeStorageDiagnostics() {
  const hasFirebaseUrl = Boolean(
    normalizeEnvValue(
      process.env.FIREBASE_DB_URL ||
        process.env.FIREBASE_DATABASE_URL ||
        process.env.SB_FIREBASE_DB_URL ||
        process.env.NEXT_PUBLIC_FIREBASE_DB_URL ||
        process.env.FIREBASE_CREDENTIALS ||
        process.env.FIREBASE_CONFIG ||
        process.env.SB_FIREBASE_CONFIG
    )
  );
  const hasFirebaseSecret = Boolean(
    normalizeEnvValue(
      process.env.FIREBASE_DB_SECRET ||
        process.env.FIREBASE_SECRET ||
        process.env.FIREBASE_DATABASE_SECRET ||
        process.env.SB_FIREBASE_DB_SECRET ||
        process.env.NEXT_PUBLIC_FIREBASE_DB_SECRET ||
        process.env.FIREBASE_CREDENTIALS ||
        process.env.FIREBASE_CONFIG ||
        process.env.SB_FIREBASE_CONFIG
    )
  );
  const hasKv = hasKvCredentials();
  return `runtime vercel=${process.env.VERCEL ?? "0"} env=${process.env.VERCEL_ENV ?? "unknown"} url=${process.env.VERCEL_URL ?? "none"} firebase_url_var=${hasFirebaseUrl ? "yes" : "no"} firebase_secret_var=${hasFirebaseSecret ? "yes" : "no"} kv=${hasKv ? "yes" : "no"}`;
}
