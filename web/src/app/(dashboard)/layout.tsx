import Link from 'next/link';
import { ThemeToggle } from "@/components/ThemeToggle";
import { getSession } from "@/lib/auth-lib";
import { handleLogout } from "@/app/actions/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64 bg-card p-4 border-r border-border flex flex-col">
                <h1 className="mb-4 text-xl font-bold flex items-center gap-2">
                    <span className="text-primary">TreeTech</span>
                </h1>

                {session && (
                    <div className="mb-6 px-2 py-3 bg-[var(--background)] rounded-lg border border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Logged in as</p>
                        <p className="text-sm font-bold text-white truncate">{session.name || session.email}</p>
                        <span className="text-xs bg-[var(--primary)] text-black px-2 py-0.5 rounded-full font-bold mt-1 inline-block">
                            {session.role}
                        </span>
                    </div>
                )}

                <nav className="flex-grow">
                    <ul>
                        <li className="mb-2">
                            <Link href="/" className="text-muted-foreground hover:text-primary hover:underline transition-colors block py-2">
                                <span className="mr-2">🏠</span> Home
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link href="/recruiting" className="text-muted-foreground hover:text-primary hover:underline transition-colors block py-2">
                                <span className="mr-2">👥</span> Recruiting
                            </Link>
                        </li>
                        {(session?.role === 'Owner' || session?.role === 'Admin') && (
                            <li className="mb-2">
                                <Link href="/recruiting/team" className="text-muted-foreground hover:text-primary hover:underline transition-colors block py-2">
                                    <span className="mr-2">🛡️</span> Team
                                </Link>
                            </li>
                        )}
                        <li className="mb-2">
                            <Link href="/recruiting/settings" className="text-muted-foreground hover:text-primary hover:underline transition-colors block py-2">
                                <span className="mr-2">⚙️</span> Settings
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="pt-4 border-t border-border flex flex-col gap-4">
                    <ThemeToggle />
                    <form action={handleLogout}>
                        <button className="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 px-2 py-2 rounded hover:bg-red-900/10">
                            <span>🚪</span> Logout
                        </button>
                    </form>
                </div>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}
