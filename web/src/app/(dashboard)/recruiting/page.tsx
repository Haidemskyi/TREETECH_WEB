"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Users, XCircle, Plus, X } from "lucide-react";
import { getCandidates, createCandidate, type CandidateData } from "@/app/actions/candidates";

export default function RecruitingPage() {
    const [candidates, setCandidates] = useState<CandidateData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCandidate, setNewCandidate] = useState({ name: "", email: "", phone: "", source: "Manual" });

    // Filter States
    const [statusFilter, setStatusFilter] = useState<"All" | "InProgress" | "Hired" | "Rejected">("All");
    const [searchQuery, setSearchQuery] = useState("");

    const loadData = async () => {
        const data = await getCandidates();
        setCandidates(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddCandidate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCandidate.name) return;

        await createCandidate(newCandidate);
        await loadData();
        setIsModalOpen(false);
        setNewCandidate({ name: "", email: "", phone: "", source: "Manual" });
    };

    // Stats Calculations
    const inProgressCount = candidates.filter(c => ['New', 'Contacted', 'Interviewing'].includes(c.status)).length;
    const hiredCount = candidates.filter(c => c.status === 'Hired').length;
    const rejectedCount = candidates.filter(c => c.status === 'Rejected').length;

    // Filtering Logic
    const filteredCandidates = candidates.filter(c => {
        // 1. Search Filter
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()));
        if (!matchesSearch) return false;

        // 2. Status Filter
        if (statusFilter === "All") return true;
        if (statusFilter === "Hired") return c.status === "Hired";
        if (statusFilter === "Rejected") return c.status === "Rejected";
        if (statusFilter === "InProgress") return ['New', 'Contacted', 'Interviewing'].includes(c.status);

        return true;
    });

    return (
        <div className="space-y-8 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Recruiting</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage candidates and hiring pipelines.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        <Plus className="h-4 w-4" /> Add Candidate
                    </button>
                </div>
            </div>

            {/* Pipeline Stats (Clickable Filters) */}
            <div className="grid gap-6 md:grid-cols-4">
                <div onClick={() => setStatusFilter("All")} className="cursor-pointer transition-transform active:scale-95">
                    <StatCard
                        title="All Candidates"
                        value={candidates.length.toString()}
                        icon={Users}
                        className={cn(statusFilter === "All" ? "ring-2 ring-primary" : "hover:border-primary/50")}
                    />
                </div>
                <div onClick={() => setStatusFilter("InProgress")} className="cursor-pointer transition-transform active:scale-95">
                    <StatCard
                        title="In Progress"
                        value={inProgressCount.toString()}
                        className={cn(
                            "border-blue-200 bg-blue-50 dark:bg-blue-950/20",
                            statusFilter === "InProgress" ? "ring-2 ring-blue-500" : "hover:border-blue-500/50"
                        )}
                        icon={Clock}
                    />
                </div>
                <div onClick={() => setStatusFilter("Hired")} className="cursor-pointer transition-transform active:scale-95">
                    <StatCard
                        title="Hired"
                        value={hiredCount.toString()}
                        className={cn(
                            "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20",
                            statusFilter === "Hired" ? "ring-2 ring-emerald-500" : "hover:border-emerald-500/50"
                        )}
                        icon={CheckCircle2}
                    />
                </div>
                <div onClick={() => setStatusFilter("Rejected")} className="cursor-pointer transition-transform active:scale-95">
                    <StatCard
                        title="Rejected"
                        value={rejectedCount.toString()}
                        className={cn(
                            "border-rose-200 bg-rose-50 dark:bg-rose-950/20",
                            statusFilter === "Rejected" ? "ring-2 ring-rose-500" : "hover:border-rose-500/50"
                        )}
                        icon={XCircle}
                    />
                </div>
            </div>

            {/* Main Content - Candidate List */}
            <div className="rounded-md border bg-card shadow-sm">
                <div className="p-6 border-b flex items-center justify-between gap-4">
                    <div>
                        <h3 className="font-semibold text-lg">Candidates</h3>
                        <p className="text-sm text-muted-foreground">
                            {statusFilter === 'All' ? 'Showing all candidates' : `Showing ${statusFilter} candidates`}
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative max-w-sm w-full">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="w-full pl-4 pr-4 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Source</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Contacts</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Added</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredCandidates.map((c) => (
                                <tr key={c.id} className="border-b transition-colors hover:bg-muted/50 group">
                                    <td className="p-4 align-middle font-medium relative">
                                        {/* Make the whole name cell clickable with the link positioned absolutely */}
                                        <Link href={`/recruiting/${c.id}`} className="hover:underline text-primary">
                                            {c.name}
                                        </Link>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <StatusBadge status={c.status} />
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">{c.source}</td>
                                    <td className="p-4 align-middle text-muted-foreground text-xs">
                                        {c.email && <div>{c.email}</div>}
                                        {c.phone && <div>{c.phone}</div>}
                                    </td>
                                    <td className="p-4 align-middle text-right font-medium">{c.createdAt}</td>
                                </tr>
                            ))}
                            {filteredCandidates.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No candidates found matching filters.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card w-full max-w-md rounded-xl shadow-lg border p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">New Candidate</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleAddCandidate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <input required className="w-full border rounded-md px-3 py-2" value={newCandidate.name} onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <input type="email" className="w-full border rounded-md px-3 py-2" value={newCandidate.email} onChange={e => setNewCandidate({ ...newCandidate, email: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <input type="tel" className="w-full border rounded-md px-3 py-2" value={newCandidate.phone} onChange={e => setNewCandidate({ ...newCandidate, phone: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Source</label>
                                <select className="w-full border rounded-md px-3 py-2" value={newCandidate.source} onChange={e => setNewCandidate({ ...newCandidate, source: e.target.value })}>
                                    <option value="Manual">Manual Entry</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Referral">Referral</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium">Add Candidate</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        New: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        Contacted: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        Interviewing: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        Hired: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        Rejected: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    }

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", styles[status] || styles.New)}>
            {status}
        </span>
    )
}
