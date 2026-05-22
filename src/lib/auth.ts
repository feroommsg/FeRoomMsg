import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")

export async function createToken(payload: { email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { email: string }
  } catch {
    return null
  }
}

export function getTokenFromCookie() {
  if (typeof document === "undefined") return null
  const cookies = document.cookie.split("; ")
  const tokenCookie = cookies.find((c) => c.startsWith("admin_token="))
  return tokenCookie ? tokenCookie.split("=")[1] : null
}
