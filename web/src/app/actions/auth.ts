"use server";

import { compare } from "bcryptjs";
import { encrypt, login, logout } from "@/lib/auth-lib";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RowDataPacket } from "mysql2"; // Assuming mysql2 types available or similar

export async function handleLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        const user = rows[0];

        if (!user) {
            return { error: "Invalid credentials." };
        }

        // Verify password
        // Note: In setup-auth.js we used bcrypt.hash. 
        // Wait, in setup-auth.js I commented out the hash part in the thought process but implemented it in code?
        // Let's check user inputs. The user said: "owner@treetech.com/ temproarypass"
        // My setup script should have hashed 'temproarypass'.
        // Here we compare plain text 'password' with 'user.password_hash'.

        // IMPORTANT: In my previous thought I wasn't sure if bcryptjs was working in the script.
        // I ran `node setup-auth.js` AFTER installing bcryptjs. So it should have hashed correctly.

        const isValid = await compare(password, user.password_hash);

        if (!isValid) {
            return { error: "Invalid credentials." };
        }

        // Create session
        const session = await encrypt({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        });

        const cookieStore = await cookies();
        cookieStore.set("session", session, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            path: '/'
        });

    } catch (error) {
        console.error("Login error:", error);
        return { error: "Something went wrong." };
    }

    redirect("/recruiting");
}

export async function handleLogout() {
    const cookieStore = await cookies();
    cookieStore.set("session", "", { expires: new Date(0), path: '/' });
    redirect("/login");
}
