"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCandidateById, updateCandidate, getCandidateHistory, type CandidateData, type HistoryEvent } from "@/app/actions/candidates";
import { ArrowLeft, User, FileText, Calendar, Mail, Phone, Briefcase } from "lucide-react";

export default function CandidateProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [candidate, setCandidate] = useState<CandidateData | null>(null);
    const [history, setHistory] = useState<HistoryEvent[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit State
    const [age, setAge] = useState<string>("");
    const [status, setStatus] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function load() {
            if (!id) return;

            try {
                const [data, historyData] = await Promise.all([
                    getCandidateById(id),
                    getCandidateHistory(id)
                ]);

                if (data) {
                    setCandidate(data);
                    setAge(data.age?.toString() || "");
                    setStatus(data.status);
                }
                setHistory(historyData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        setStatus(newStatus);
        await updateCandidate(id, { status: newStatus });
        // Refresh history immediately
        const h = await getCandidateHistory(id);
        setHistory(h);
    };

    const handleSaveDetails = async () => {
        setIsSaving(true);
        await updateCandidate(id, { age: age ? parseInt(age) : 0 });
        // Refresh history
        const h = await getCandidateHistory(id);
        setHistory(h);

        setIsSaving(false);
    };

    if (loading) return <div className="p-8">Loading profile...</div>;
    if (!candidate) return <div className="p-8">Candidate not found</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Back Button */}
            <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to Recruiting
            </button>

            {/* Header Card */}
            <div className="bg-card border rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-bold text-muted-foreground">
                        {candidate.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{candidate.name}</h1>
                        <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                            {candidate.email && <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {candidate.email}</span>}
                            {candidate.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {candidate.phone}</span>}
                        </div>
                    </div>
                </div>

                {/* Status Dropdown */}
                <div className="flex flex-col items-end gap-2">
                    <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="bg-background border rounded-md px-4 py-2 font-medium focus:ring-2 focus:ring-primary outline-none"
                    >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Left Column: Details */}
                <div className="md:col-span-2 space-y-8">

                    {/* Personal Info */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <User className="h-5 w-5" /> Personal Details
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Age</label>
                                <input
                                    type="number"
                                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Not set"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Source</label>
                                <div className="p-2 bg-secondary rounded-md text-sm">{candidate.source || "Manual"}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role Applied</label>
                                <div className="p-2 bg-secondary rounded-md text-sm">Cable Technician (Default)</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date Applied</label>
                                <div className="p-2 bg-secondary rounded-md text-sm">{candidate.createdAt}</div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSaveDetails}
                                disabled={isSaving}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save Details"}
                            </button>
                        </div>
                    </div>

                    {/* Documents Placeholder */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm opacity-60">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5" /> Documents
                        </h2>
                        <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                            <p>Drag and drop files here (Coming Soon)</p>
                            <button className="mt-4 text-primary text-sm font-medium hover:underline" disabled>Upload Resume/ID</button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Timeline/Notes */}
                <div className="space-y-8">

                    {/* Notes Section */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5" /> Notes
                        </h2>
                        <textarea
                            className="w-full h-32 bg-background border rounded-md p-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                            placeholder="Add notes about this candidate..."
                            value={candidate.notes || ""}
                            onChange={(e) => setCandidate({ ...candidate, notes: e.target.value })}
                        ></textarea>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={async () => {
                                    setIsSaving(true);
                                    await updateCandidate(id, { notes: candidate.notes });
                                    setIsSaving(false);
                                    // Refresh history?
                                    const h = await getCandidateHistory(id);
                                    setHistory(h);
                                }}
                                disabled={isSaving}
                                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {isSaving ? "Saving..." : "Save Notes"}
                            </button>
                        </div>
                    </div>

                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Briefcase className="h-5 w-5" /> Pipeline History
                        </h2>
                        <div className="space-y-6 relative pl-4 border-l-2 border-muted ml-2">
                            {history.length === 0 ? (
                                <div className="text-sm text-muted-foreground">No history items yet.</div>
                            ) : (
                                history.map((item) => (
                                    <div className="relative" key={item.id}>
                                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary" />
                                        <p className="font-medium text-sm">{item.event}</p>
                                        <p className="text-xs text-muted-foreground">{item.createdAt}</p>
                                        {item.details && <p className="text-xs text-muted-foreground mt-1 bg-secondary p-1 rounded inline-block">{item.details}</p>}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Delete Zone */}
                    <div className="pt-8 border-t border-border">
                        <button
                            onClick={async () => {
                                if (confirm("Are you sure you want to PERMANENTLY delete this candidate? This action cannot be undone.")) {
                                    const { deleteCandidate } = await import("@/app/actions/candidates");
                                    const res = await deleteCandidate(id);
                                    if (res?.error) {
                                        alert(res.error);
                                    } else {
                                        router.push("/recruiting");
                                    }
                                }
                            }}
                            className="w-full border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 py-3 rounded-md font-bold uppercase tracking-widest text-xs transition-all"
                        >
                            Delete Candidate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
