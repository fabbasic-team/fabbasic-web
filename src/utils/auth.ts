const SECRET = process.env.ADMIN_SESSION_SECRET || "fab-basic-stitch-style-elegance-2026-key";
const encoder = new TextEncoder();

export interface AdminSession {
  email: string;
  role: string;
  issuedAt: number;
  expiresAt: number;
}

function bufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signAdminSession(email: string): Promise<string> {
  const payload: AdminSession = {
    email,
    role: "admin",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadString = JSON.stringify(payload);
  const payloadBase64 = bufferToBase64Url(encoder.encode(payloadString));

  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadBase64)
  );
  const signatureBase64 = bufferToBase64Url(signatureBuffer);

  return `${payloadBase64}.${signatureBase64}`;
}

export async function verifyAdminSession(
  token: string | undefined | null
): Promise<AdminSession | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadBase64, signatureBase64] = parts;

  try {
    const key = await getHmacKey();
    const signatureBytes = base64UrlToUint8Array(signatureBase64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      encoder.encode(payloadBase64)
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlToUint8Array(payloadBase64);
    const payloadString = new TextDecoder().decode(payloadBytes);
    const payload: AdminSession = JSON.parse(payloadString);

    if (Date.now() > payload.expiresAt) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
