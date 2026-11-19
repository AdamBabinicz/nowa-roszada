import { NextResponse } from "next/server";
import { scryptSync, timingSafeEqual } from "node:crypto";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  isAdminAuthenticated,
} from "@/lib/auth/session";

function safeEqualText(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function verifyPasswordHash(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;

  const [salt, keyHex] = parts;
  if (!salt || !keyHex) return false;

  const keyBuf = Buffer.from(keyHex, "hex");
  const derivedBuf = scryptSync(password, salt, keyBuf.length);
  if (keyBuf.length !== derivedBuf.length) return false;

  return timingSafeEqual(keyBuf, derivedBuf);
}

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inputEmail = String(body.email || "")
      .trim()
      .toLowerCase();
    const inputPassword = String(body.password || "");

    const expectedEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const expectedHash = (process.env.ADMIN_PASSWORD_HASH || "").trim();

    if (!expectedEmail || !expectedHash) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Brak zmiennych ADMIN_EMAIL lub ADMIN_PASSWORD_HASH na serwerze.",
        },
        { status: 500 },
      );
    }

    const emailOk = safeEqualText(inputEmail, expectedEmail);
    const passwordOk = verifyPasswordHash(inputPassword, expectedHash);

    if (!emailOk || !passwordOk) {
      return NextResponse.json(
        { success: false, error: "Nieprawidłowy adres e-mail lub hasło." },
        { status: 401 },
      );
    }

    const token = createSessionToken(expectedEmail);
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Brak poprawnej zmiennej ADMIN_SESSION_SECRET (min. 16 znaków).",
        },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Błąd autoryzacji." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
