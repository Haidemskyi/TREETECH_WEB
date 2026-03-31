"use server";

import pool from "@/lib/db";
import { encrypt, getSession } from "@/lib/auth-lib";
import { hash, compare } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from 'uuid';

export async function getUsers() {
    const session = await getSession();
    if (!session || (session.role !== "Owner" && session.role !== "Admin")) {
        return [];
    }

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
        );
        return rows;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}

export async function createUser(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session || (session.role !== "Owner" && session.role !== "Admin")) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        return { error: "All fields are required" };
    }

    try {
        // Check if email exists
        const [existing] = await pool.execute<RowDataPacket[]>(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return { error: "User with this email already exists" };
        }

        const hashedPassword = await hash(password, 10);
        const id = uuidv4(); // Or generate generic ID

        await pool.execute(
            "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, 'HR')",
            [id, name, email, hashedPassword]
        );

        revalidatePath("/recruiting/team");
        return { success: "User created successfully" };
    } catch (error) {
        console.error("Failed to create user:", error);
        return { error: "Failed to create user" };
    }
}

export async function deleteUser(userId: string) {
    const session = await getSession();
    if (!session || (session.role !== "Owner" && session.role !== "Admin")) {
        return { error: "Unauthorized" };
    }

    if (userId === session.id) {
        return { error: "Cannot delete yourself" };
    }

    try {
        // Prevent deleting Owners if you are just an Admin? 
        // Logic: Owner can delete anyone (except self). Admin can delete HR?
        // User requirement: "owner can delete and add New HR".
        // Let's restrict deletion to HR users only if we want to be safe, or check roles.

        // Check target user role
        const [targetRows] = await pool.execute<RowDataPacket[]>(
            "SELECT role FROM users WHERE id = ?",
            [userId]
        );

        if (targetRows.length === 0) return { error: "User not found" };

        const targetUser = targetRows[0];

        if (targetUser.role === 'Owner') {
            return { error: "Cannot delete an Owner" };
        }

        await pool.execute("DELETE FROM users WHERE id = ?", [userId]);
        revalidatePath("/recruiting/team");
        return { success: "User deleted" };
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { error: "Failed to delete user" };
    }
}

export async function changeOwnPassword(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: "All fields are required" };
    }

    if (newPassword !== confirmPassword) {
        return { error: "New passwords do not match" };
    }

    try {
        // Fetch user to get current hash
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT password_hash FROM users WHERE id = ?",
            [session.id]
        );

        const user = rows[0];
        if (!user) return { error: "User not found" };

        // Verify current password
        const isValid = await compare(currentPassword, user.password_hash);

        if (!isValid) {
            return { error: "Incorrect current password" };
        }

        // Update with new hash
        const hashedPassword = await hash(newPassword, 10);
        await pool.execute(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            [hashedPassword, session.id]
        );

        return { success: "Password updated successfully" };

    } catch (error) {
        console.error("Change password error:", error);
        return { error: "Failed to update password" };
    }
}

export async function adminResetPassword(userId: string, newPassword: string) {
    const session = await getSession();
    if (!session || session.role !== "Admin") {
        return { error: "Unauthorized" };
    }

    if (!newPassword) return { error: "New password is required" };

    try {
        const hashedPassword = await hash(newPassword, 10);
        await pool.execute(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            [hashedPassword, userId]
        );
        revalidatePath("/recruiting/team");
        return { success: "Password reset successfully" };
    } catch (error) {
        console.error("Admin reset password error:", error);
        return { error: "Failed to reset password" };
    }
}
