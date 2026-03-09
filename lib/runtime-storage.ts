export interface FirebaseCredentials {
  base: string;
  secret: string;
}

export type StorageDiagnosisCode =
  | "OK_FIREBASE"
  | "OK_KV"
  | "NO_STORAGE_VARS"
  | "FIREBASE_URL_MISSING"
  | "FIREBASE_SECRET_MISSING"
  | "FIREBASE_URL_INVALID"
  | "FIREBASE_COMBINED_INVALID"
  | "KV_PARTIAL_CONFIG"
  | "UNKNOWN_STORAGE_MISMATCH";

export interface StorageDiagnosis {
  code: StorageDiagnosisCode;
  message: string;
  hints: string[];
  runtime: string;
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
        process.env.NEXT_PUBLIC_FIREBASE_DB_URL
    )
  );
  const hasFirebaseSecret = Boolean(
    normalizeEnvValue(
      process.env.FIREBASE_DB_SECRET ||
        process.env.FIREBASE_SECRET ||
        process.env.FIREBASE_DATABASE_SECRET ||
        process.env.SB_FIREBASE_DB_SECRET ||
        process.env.NEXT_PUBLIC_FIREBASE_DB_SECRET
    )
  );
  const hasCombined = Boolean(
    normalizeEnvValue(process.env.FIREBASE_CREDENTIALS || process.env.FIREBASE_CONFIG || process.env.SB_FIREBASE_CONFIG)
  );
  const hasKv = hasKvCredentials();
  return `runtime vercel=${process.env.VERCEL ?? "0"} env=${process.env.VERCEL_ENV ?? "unknown"} url=${process.env.VERCEL_URL ?? "none"} firebase_url_var=${hasFirebaseUrl ? "yes" : "no"} firebase_secret_var=${hasFirebaseSecret ? "yes" : "no"} firebase_combined_var=${hasCombined ? "yes" : "no"} kv=${hasKv ? "yes" : "no"}`;
}

function isLikelyFirebaseUrl(url: string) {
  return /^https?:\/\/[a-z0-9-]+\.firebaseio\.com\/?$/i.test(url);
}

export function diagnoseStorageConfiguration(): StorageDiagnosis {
  const combined = normalizeEnvValue(
    process.env.FIREBASE_CREDENTIALS || process.env.FIREBASE_CONFIG || process.env.SB_FIREBASE_CONFIG
  );
  const parsedCombined = combined ? parseCombinedFirebaseConfig(combined) : { base: "", secret: "" };

  const splitBase = normalizeEnvValue(
    process.env.FIREBASE_DB_URL ||
      process.env.FIREBASE_DATABASE_URL ||
      process.env.SB_FIREBASE_DB_URL ||
      process.env.NEXT_PUBLIC_FIREBASE_DB_URL
  );
  const splitSecret = normalizeEnvValue(
    process.env.FIREBASE_DB_SECRET ||
      process.env.FIREBASE_SECRET ||
      process.env.FIREBASE_DATABASE_SECRET ||
      process.env.SB_FIREBASE_DB_SECRET ||
      process.env.NEXT_PUBLIC_FIREBASE_DB_SECRET
  );

  const firebaseCreds = resolveFirebaseCredentials();
  if (firebaseCreds.base && firebaseCreds.secret) {
    return {
      code: "OK_FIREBASE",
      message: "Firebase credentials detected.",
      hints: [],
      runtime: runtimeStorageDiagnostics(),
    };
  }

  if (hasKvCredentials()) {
    return {
      code: "OK_KV",
      message: "KV credentials detected.",
      hints: [],
      runtime: runtimeStorageDiagnostics(),
    };
  }

  const kvUrlPresent = Boolean(normalizeEnvValue(process.env.KV_REST_API_URL));
  const kvTokenPresent = Boolean(normalizeEnvValue(process.env.KV_REST_API_TOKEN));
  const runtime = runtimeStorageDiagnostics();

  if (!combined && !splitBase && !splitSecret && !kvUrlPresent && !kvTokenPresent) {
    return {
      code: "NO_STORAGE_VARS",
      message: "No Firebase or KV environment variables are visible in this runtime.",
      hints: [
        "Set FIREBASE_DB_URL and FIREBASE_DB_SECRET in this exact Vercel project.",
        "Confirm scope includes Production and redeploy.",
      ],
      runtime,
    };
  }

  if (combined && (!parsedCombined.base || !parsedCombined.secret) && !splitBase && !splitSecret) {
    return {
      code: "FIREBASE_COMBINED_INVALID",
      message: "Combined Firebase variable is present but invalid.",
      hints: [
        "Use FIREBASE_CREDENTIALS format: https://<db>.firebaseio.com/|<secret>",
        "Or set FIREBASE_DB_URL and FIREBASE_DB_SECRET separately.",
      ],
      runtime,
    };
  }

  if (!splitBase && splitSecret) {
    return {
      code: "FIREBASE_URL_MISSING",
      message: "Firebase secret is present but Firebase URL is missing.",
      hints: ["Set FIREBASE_DB_URL = https://<db>.firebaseio.com/"],
      runtime,
    };
  }

  if (splitBase && !splitSecret) {
    return {
      code: "FIREBASE_SECRET_MISSING",
      message: "Firebase URL is present but Firebase secret is missing.",
      hints: ["Set FIREBASE_DB_SECRET with a valid database secret/token."],
      runtime,
    };
  }

  if (splitBase && !isLikelyFirebaseUrl(splitBase)) {
    return {
      code: "FIREBASE_URL_INVALID",
      message: "Firebase URL format looks invalid.",
      hints: ["Expected format: https://<project>-default-rtdb.firebaseio.com/"],
      runtime,
    };
  }

  if ((kvUrlPresent && !kvTokenPresent) || (!kvUrlPresent && kvTokenPresent)) {
    return {
      code: "KV_PARTIAL_CONFIG",
      message: "KV is partially configured.",
      hints: ["Set both KV_REST_API_URL and KV_REST_API_TOKEN, or remove both."],
      runtime,
    };
  }

  return {
    code: "UNKNOWN_STORAGE_MISMATCH",
    message: "Storage variables are present but did not resolve to a valid backend.",
    hints: ["Re-enter Firebase vars without quotes/spaces and redeploy."],
    runtime,
  };
}

export function formatStorageDiagnosisError(prefix: string): string {
  const diagnosis = diagnoseStorageConfiguration();
  const hints = diagnosis.hints.length > 0 ? ` Hints: ${diagnosis.hints.join(" ")}` : "";
  return `${prefix} [${diagnosis.code}] ${diagnosis.message}${hints} ${diagnosis.runtime}`;
}
