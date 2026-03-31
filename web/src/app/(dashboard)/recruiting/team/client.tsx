"use client";

import { createUser, deleteUser } from "@/app/actions/users";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeamPage({ users }: { users: any[] }) {
    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    async function handleCreate(formData: FormData) {
        const res = await createUser(null, formData);
        if (res?.error) {
            setMessage(res.error);
        } else {
            setMessage("");
            setIsAdding(false);
            // router.refresh(); // Automatically handled by revalidatePath in action? 
            // Sometimes client router refresh is needed to see instant updates if action implies it.
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to remove this user?")) return;

        const res = await deleteUser(id);
        if (res?.error) {
            alert(res.error);
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
                    <p className="text-muted-foreground">Manage authorized personnel.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-[var(--primary)] text-black font-bold px-4 py-2 rounded hover:opacity-90 transition-colors"
                >
                    {isAdding ? "Cancel" : "+ Add New HR"}
                </button>
            </div>

            {message && (
                <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-200 rounded">
                    {message}
                </div>
            )}

            {isAdding && (
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold mb-4">Add New HR Member</h3>
                    <form action={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input name="name" type="text" required className="w-full bg-[var(--background)] border border-white/10 rounded p-2" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input name="email" type="email" required className="w-full bg-[var(--background)] border border-white/10 rounded p-2" placeholder="hr@treetech.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input name="password" type="text" required className="w-full bg-[var(--background)] border border-white/10 rounded p-2" placeholder="StrongPassword123" />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="bg-white text-black font-bold px-6 py-2 rounded hover:bg-gray-200">
                                Create Member
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="rounded-md border border-border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {users.map((user) => (
                                <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{user.name}</td>
                                    <td className="p-4 align-middle">{user.email}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${user.role === 'Owner' ? 'bg-purple-900 text-purple-100' :
                                                user.role === 'Admin' ? 'bg-blue-900 text-blue-100' :
                                                    'bg-teal-900 text-teal-100'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">Active</td>
                                    <td className="p-4 align-middle text-right">
                                        {user.role === 'HR' && (
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-500 hover:text-red-400 font-medium text-xs uppercase tracking-wide border border-red-500/20 bg-red-500/10 px-3 py-1 rounded transition-colors hover:bg-red-500/20"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No team members found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
