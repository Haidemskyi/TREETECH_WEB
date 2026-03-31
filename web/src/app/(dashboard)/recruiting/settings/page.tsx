"use client";

import { changeOwnPassword } from "@/app/actions/users";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
            {pending ? "Updating..." : "Update Password"}
        </button>
    );
}

export default function SettingsPage() {
    const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        const res = await changeOwnPassword(null, formData);
        setMessage(res);
        if (res?.success) {
            // optionally reset form
            (document.getElementById("pw-form") as HTMLFormElement)?.reset();
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account preferences.</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    🔒 Change Password
                </h3>

                <form id="pw-form" action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <input
                            name="currentPassword"
                            type="password"
                            required
                            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">New Password</label>
                            <input
                                name="newPassword"
                                type="password"
                                required
                                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirm New Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                    </div>

                    {message?.error && (
                        <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded">
                            {message.error}
                        </div>
                    )}
                    {message?.success && (
                        <div className="bg-teal-500/10 text-teal-500 text-sm p-3 rounded">
                            {message.success}
                        </div>
                    )}

                    <div className="pt-4">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
