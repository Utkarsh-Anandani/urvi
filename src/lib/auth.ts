import { promisify } from "util";
import crypto from "crypto";
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const scryptAsync = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return { salt, hash: derivedKey.toString("hex") };
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string,
) {
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), derivedKey);
}

export type SessionData = {
  id?: string;
  email?: string;
  role?: "USER" | "ADMIN";
  loggedIn: boolean;
};

export const sessionOptions: SessionOptions = {
  cookieName: "auth-session",
  password: process.env.SESSION_PASSWORD!,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions,
  );

  if (!session.loggedIn) session.loggedIn = false;

  return session;
}

export async function signOut() {
  const session = await getSession();
  session.destroy();
}

export async function requireAuth() {
  const session = await getSession();

  if(!session.loggedIn) {
    redirect('/signin');
  }
}

export async function requireRole(role: 'USER' | 'ADMIN') {
  const session = await getSession();

  if(!session.loggedIn) {
    redirect('/signin');
  }

  if(session.role !== role) {
    redirect('/unauthorized');
  }
}