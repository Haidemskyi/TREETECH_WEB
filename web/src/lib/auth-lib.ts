import { compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-change-this";
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function login(formData: FormData) {
    // Not used directly, verifying credentials happens in server action
}

export async function logout() {
    (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch (error) {
        return null;
    }
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    try {
        // Refresh user session logic if needed
        const parsed = await decrypt(session);
        parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // extends by 1 day
        const res = NextResponse.next();
        res.cookies.set({
            name: "session",
            value: await encrypt(parsed),
            httpOnly: true,
            expires: parsed.expires,
        });
        return res;
    } catch (error) {
        // If the session token is invalid, we simply ignore it and do not crash.
        // The middleware loop will eventually just let it pass or redirect if accessing a protected route.
        // We should return next() to ensure request proceeds (likely to login if middleware checks it later, 
        // or if this is just updating session on a public route).
        return NextResponse.next();
    }
}
