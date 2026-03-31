"use client";

import { handleLogin } from "@/app/actions/auth";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setError("");

        const result = await handleLogin(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // If success, the server action redirects, so we don't need to do anything else.
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
            <div className="w-full max-w-md bg-[#121212] border border-white/5 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                {/* Glow Effects */}
                <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-[var(--primary)] opacity-10 blur-[50px] rounded-full point-events-none"></div>
                <div className="absolute bottom-[-20px] right-[-20px] w-40 h-40 bg-purple-600 opacity-10 blur-[60px] rounded-full point-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="w-20 h-20 bg-[var(--background)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--primary)] shadow-[0_0_20px_rgba(28,237,200,0.2)]">
                        <span className="text-3xl">📡</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-widest uppercase">
                        TREE<span className="text-[var(--primary)]">TECH</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-2 font-light">Internal Portal Access</p>
                </div>

                <form action={onSubmit} className="flex flex-col gap-5 relative z-10">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="admin@treetech.com"
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-gray-700"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-900/50 text-red-200 text-sm p-3 rounded-lg text-center animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--primary)] text-[#050505] font-black py-4 rounded-lg hover:bg-white transition-all transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(28,237,200,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-4 uppercase tracking-widest"
                    >
                        {loading ? "Authenticating..." : "Login"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-600">Authorized Personnel Only</p>
                </div>
            </div>
        </div>
    );
}
