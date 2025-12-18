import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.SESSION_SECRET || "default-secret-key-change-me";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function login(password: string) {
    const correctPassword = process.env.APP_PASSWORD;

    if (!correctPassword) {
        // If no password configured, always allow (or fail? Plan said restrict. Let's fail secure)
        // Actually plan said "If this variable is set, the app requires login."
        // So if not set, maybe we just return success? But the middleware needs to know.
        // Let's assume if it is NOT set, we don't block. But here we are logging in.
        // If NOT set, login should be impossible or unnecessary.
        // Let's implement strict checking: APP_PASSWORD must match.
        return false;
    }

    if (password !== correctPassword) return false;

    // Create session
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ user: "admin", expires });

    const cookieStore = await cookies();
    cookieStore.set("session", session, { httpOnly: true, expires });
    return true;
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch (error) {
        return null;
    }
}
